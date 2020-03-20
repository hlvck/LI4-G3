﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using GestaoFlorestas.WebSite.Models;

namespace GestaoFlorestas.WebSite.Services
{
    public class TrabalhadorCamDAO
    {
        private String server;
        private String database;
        private String userId;
        private String pass;
        private SqlConnection con;

        public TrabalhadorCamDAO()
        {
            Initialize();
        }

        private void Initialize()
        {
            this.server = "1920li4.database.windows.net";
            this.database = "GestaoFlorestal";
            this.userId = "li4_1920";
            this.pass = "Grupo3li";
            String connectionString = "Server=" + server + "; Database=" + database + "; User Id=" + userId + "; Password=" + pass + ";";
            this.con = new SqlConnection(connectionString);
        }

        private bool OpenConnection()
        {
            try
            {
                con.Open();
                return true;
            }
            catch (SqlException ex)
            {
                switch (ex.Number)
                {
                    case 0:
                        Console.WriteLine("Cannot connect to server.");
                        break;
                    case 1045:
                        Console.WriteLine("Invalid username/password.");
                        break;
                }
                return false;
            }
        }

        private bool CloseConnection()
        {
            try
            {
                con.Close();
                return true;
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }

        
        public void put(Trabalhador_da_Camara tp)
        {
            String query;
            if (containsTrabalhador(tp.getUsername()))
            {
                query = "UPDATE Trabalhador SET password=@password,nome=@nome,nomeConcelho=@con WHERE username=@username ;";
            }
            else
            {
                query = "INSERT INTO Trabalhador (username,password,nome,nomeConcelho) VALUES(@username,@password,@nome,@con);";
            }
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", tp.getUsername());
            cmd.Parameters.AddWithValue("@password", tp.getPassword());
            cmd.Parameters.AddWithValue("@con", tp.getConcelho());
            cmd.Parameters.AddWithValue("@nome", tp.getNome());
            if (this.OpenConnection() == true)
            {
                int r = cmd.ExecuteNonQuery();
                this.CloseConnection();
            }

            foreach (int a in (List<int>)tp.getTerrenosPendentes())
            {
                if (!containsLimpeza(a, tp.getUsername()))
                {
                    query = "INSERT INTO Limpeza VALUES(@idTerreno,@trabalhador);";

                    cmd = new SqlCommand(query, con);
                    cmd.Parameters.AddWithValue("@idTerreno", a);
                    cmd.Parameters.AddWithValue("@trabalhador", tp.getUsername());

                    if (this.OpenConnection() == true)
                    {
                        int r = cmd.ExecuteNonQuery();
                        this.CloseConnection();
                    }
                }

            }

        }

        
        public bool containsTrabalhador(String p)
        {
            bool r = false;
            string query = "Select username from Trabalhador " +
                           "where username=@username ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", p);

            if (this.OpenConnection() == true)
            {
                var value = cmd.ExecuteScalar();
                if (value != null) r = true;
                else r = false;
                this.CloseConnection();
            }
            return r;
        }

        public bool containsLimpeza(int terreno, String trabalhador)
        {
            bool r = false;
            string query = "Select * from Trabalhador " +
                           "where Trabalhador=@username AND idTerreno=@id ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", trabalhador);
            cmd.Parameters.AddWithValue("@id", terreno);

            if (this.OpenConnection() == true)
            {
                var value = cmd.ExecuteScalar();
                if (value != null) r = true;
                else r = false;
                this.CloseConnection();
            }
            return r;
        }

        public Trabalhador_da_Camara get(String user)
        {
            String username = "";
            String password = "";
            String nomeConcelho = "";
            String nome = "";
            string query = "Select * from Trabalhador " +
                               "where username=@username ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", user);

            if (this.OpenConnection() == true)
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    reader.Read();
                    
                        username = (String)reader[0];
                        password = (String)reader[1];
                        nomeConcelho = ((String)reader[3]);
                        nome = ((String)reader[2]);
                    
                }
                this.CloseConnection();
            }

            List<int> terrenos = new List<int>();

            query = "Select idTerreno from Limpeza " +
                               "where Trabalhador=@tp ;";

            cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@tp", user);
            if (this.OpenConnection() == true)
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    while (reader.Read())
                    {
                        terrenos.Add((int)reader[0]);
                    }
                }
                this.CloseConnection();
            }
            return new Trabalhador_da_Camara(nome, username, password, nomeConcelho, terrenos);

        }

        public bool LimpezaRealizada(int terreno, String trabalhador)
        {
            if (containsLimpeza(terreno, trabalhador))
            {
                String query = "DELETE FROM Limpeza WHERE idTerreno=@idTerreno,Trabalhador=@trabalhador;";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@idTerreno", terreno);
                cmd.Parameters.AddWithValue("@trabalhador", trabalhador);

                if (this.OpenConnection() == true)
                {
                    int r = cmd.ExecuteNonQuery();
                    this.CloseConnection();
                }

            }
            else return false;
            return true;
        }

    }
}