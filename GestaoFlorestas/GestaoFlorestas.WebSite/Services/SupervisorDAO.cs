﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GestaoFlorestas.WebSite.Models;
using System.Data.SqlClient;
using System.Security.Cryptography;

namespace GestaoFlorestas.WebSite.Services
{
    public class SupervisorDAO
    {
        private String server;
        private String database;
        private String userId;
        private String pass;
        private SqlConnection con;

        public SupervisorDAO()
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

        private byte[] createSalt()
        {
            byte[] salt;
            new RNGCryptoServiceProvider().GetBytes(salt = new byte[16]);
            return salt;
        }

        private byte[] creatHash(String password, byte[] salt)
        {
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000);
            byte[] hash = pbkdf2.GetBytes(20);
            return hash;
        }

        private String creatHash(String password, String salt)
        {
            var pbkdf2 = new Rfc2898DeriveBytes(password, Convert.FromBase64String(salt), 10000);
            byte[] hash = pbkdf2.GetBytes(20);
            return Convert.ToBase64String(hash);
        }

        private bool PassEquals(byte[] hashDb, byte[] hashVerificar)
        {
            for (int i = 0; i < 20; i++)
                if (hashDb[i] != hashVerificar[i])
                    return false;
            return true;
        }

        public bool verificarPassword(String pass, String user)
        {
            String passDb = null;
            byte[] salt = null;
            string query = "Select password,salt from Supervisor " +
                           "where username=@username ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", user);

            if (this.OpenConnection() == true)
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    reader.Read();
                    passDb = (String)reader[0];
                    salt = Convert.FromBase64String((String)reader[1]);
                }
                this.CloseConnection();
            }
            if (passDb != null && salt != null)
            {
                byte[] hashDb = Convert.FromBase64String(passDb);

                var pbkdf2 = new Rfc2898DeriveBytes(pass, salt, 10000);
                byte[] hashVerificar = pbkdf2.GetBytes(20);
                return PassEquals(hashDb, hashVerificar);
            }
            else return false; //User inexistente
        }


        public void put(Supervisor_Concelho s)
        {
            String query;
            int i;
            String password = "";
            String salt = "";
            if (contains(s.getUsername()))
            {
                i = 0;
                query = "UPDATE Supervisor SET nome=@nome,Concelho=@con,email=@email WHERE username=@username ;";
            }
            else
            {
                i = 1;
                query = "INSERT INTO Supervisor (username,password,nome,Concelho,email,salt) VALUES(@username,@password,@nome,@con,@email,@salt);";
                salt = Convert.ToBase64String(createSalt());
                password = creatHash(s.getPassword(), salt);
            }
            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", s.getUsername());
            if (i == 1) cmd.Parameters.AddWithValue("@password", password);
            cmd.Parameters.AddWithValue("@con", s.getConcelho());
            cmd.Parameters.AddWithValue("@nome", s.getNome());
            cmd.Parameters.AddWithValue("@email", s.getMail());
            if (i == 1) cmd.Parameters.AddWithValue("@salt", salt);
            if (this.OpenConnection() == true)
            {
                int r = cmd.ExecuteNonQuery();
                this.CloseConnection();
            }

        }

        public bool contains(String p)
        {
            bool r = false;
            string query = "Select username from Supervisor " +
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


        public Supervisor_Concelho get(String user)
        {
            String username = user;
            String password = "";
            String concelho = "";
            String nome = "";
            String email = "";
            string query = "Select * from Supervisor " +
                               "where username=@username ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", user);

            if (this.OpenConnection() == true)
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    reader.Read();
                    
                    password = (String)reader[1];
                    concelho = ((String)reader[3]);
                    nome = ((String)reader[2]);
                    email = (String)reader[4];
                    
                }
                int count = 0;
                query = "Select count(*) from Notificacao " +
                                   "where usernameUser=@username AND tipoUser=@tipo AND Visualizacao=0 ;";

                cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@username", user);
                cmd.Parameters.AddWithValue("@tipo", "Supervisor");

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    reader.Read();
                    count = (int)reader[0];
                }
                this.CloseConnection();
                return new Supervisor_Concelho(nome, username, email, password, concelho, count);
            }
            return null;

        }
        public String getSalt(String user)
        {
            String salt = "";

            string query = "Select salt from Supervisor " +
                               "where username=@username ;";

            SqlCommand cmd = new SqlCommand(query, con);
            cmd.Parameters.AddWithValue("@username", user);

            if (this.OpenConnection() == true)
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {

                    reader.Read();

                    salt = ((String)reader[0]);

                }
                this.CloseConnection();
                return salt;
            }
            return null;
        }


        public int updatePassword(String username, String password)
        {
            String query;
            String salt = "";

            query = "UPDATE Supervisor SET password=@pass WHERE username=@username ;";
            salt = getSalt(username);
            if (salt != null)
            {
                String passHashed = creatHash(password, salt);

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@pass", passHashed);

                if (this.OpenConnection() == true)
                {
                    int r = cmd.ExecuteNonQuery();
                    this.CloseConnection();
                    return 1;
                }
            }
            return 0;
        }
    }
}
