﻿using GestaoFlorestas.WebSite.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GestaoFlorestas.WebSite.Models
{
    public class Zona
    {
        private Double nivelCritico;
        private Double area;
        private String codigo_Postal;
        private Double latitude;
        private Double longitude;
        private String nomeFreguesia;
        private LocalidadeDAO freguesia;

        public Zona()
        {
            this.nivelCritico = 0;
            this.area = 0;
            this.codigo_Postal = "";
            this.latitude = 0;
            this.longitude = 0;
            this.nomeFreguesia = "";
        }

        public Zona(Double nivelCritico, Double area, String codigo_Postal, Double latitude, Double longitude, String freguesia)
        {
            this.nivelCritico = nivelCritico;
            this.area = area;
            this.codigo_Postal = codigo_Postal;
            this.latitude = latitude;
            this.longitude = longitude;
            this.nomeFreguesia = freguesia;
        }

        public Zona(Zona Z)
        {
            this.nivelCritico = Z.getNivelCritico();
            this.area = Z.getArea();
            this.codigo_Postal = Z.getCodigo_Postal();
            this.latitude = Z.getLatitude();
            this.longitude = Z.getLongitude();
        }



        public Double getNivelCritico() { return this.nivelCritico; }

        public String getCodigo_Postal() { return this.codigo_Postal; }

        public Double getArea() { return this.area; }

        public Double getLatitude() { return this.latitude; }

        public Double getLongitude() { return this.longitude; }

        public String getFreguesia() { return this.nomeFreguesia; }

        public void setNivelCritico(Double nivelCritico) { this.nivelCritico = nivelCritico; }

        public void setCodigo_Postal(String codigo_Postal) { this.codigo_Postal = codigo_Postal; }

        public void setArea(Double area) { this.area = area; }

        public void setLatitude(Double latitude) { this.latitude = latitude; }

        public void setLongitude(Double longitude) { this.longitude = longitude; }
        
        public void setNomeFreguesia(String nome) { this.nomeFreguesia = nome; }

    }
}