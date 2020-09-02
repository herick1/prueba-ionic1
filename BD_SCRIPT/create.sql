CREATE TABLE ROL(
  ROL_ID SERIAL,
  ROL_NOMBRE VARCHAR(20) NOT NULL,
  CONSTRAINT PRIMARYKEY_ROLE PRIMARY KEY (ROL_ID)
);

CREATE TABLE USUARIO(
  USU_ID SERIAL,
  USU_NOMBRE VARCHAR(30) NOT NULL,
  USU_APELLIDO VARCHAR(30) NOT NULL,
  USU_EMAIL VARCHAR(30) NOT NULL UNIQUE,
  USU_PASSWORD VARCHAR(200) NOT NULL,
  CONSTRAINT PRIMARYKEY_USUARIO PRIMARY KEY (USU_ID)
);

CREATE TABLE EVENTO(
  EVE_ID SERIAL,
  EVE_NOMBRE VARCHAR(60) NOT NULL,
  EVE_FECHA_INI DATE,
  EVE_FECHA_FIN DATE,
  EVE_DESCRIPCION VARCHAR(300),
  EVE_DIRECCION VARCHAR(200),
  CONSTRAINT PRIMARYKEY_EVENTO PRIMARY KEY (EVE_ID)
);

CREATE TABLE USUARIO_ROL(
  USU_ROL_ID SERIAL,
  USU_ROL_FK_USU_ID SERIAL NOT NULL,
  USU_ROL_FK_ROL_ID SERIAL NOT NULL,
  CONSTRAINT PRIMARYKEY_USU_ROL PRIMARY KEY (USU_ROL_ID),
  CONSTRAINT FOREIGN_USU_ROL_USUARIO FOREIGN KEY (USU_ROL_FK_USU_ID) REFERENCES USUARIO(USU_ID),
  CONSTRAINT FOREIGN_USU_ROL_ROL FOREIGN KEY (USU_ROL_FK_ROL_ID) REFERENCES ROL(ROL_ID)
);
  
CREATE TABLE USU_EVE(
  USU_EVE_ID SERIAL,
  USU_EVE_FK_USU_ID SERIAL NOT NULL,
  USU_EVE_FK_EVE_ID SERIAL NOT NULL,
  CONSTRAINT PRIMARYKEY_USU_EVE PRIMARY KEY (USU_EVE_ID),
  CONSTRAINT FOREIGN_USU_EVE_USUARIO FOREIGN KEY (USU_EVE_FK_USU_ID) REFERENCES USUARIO(USU_ID),
  CONSTRAINT FOREIGN_USU_EVE_EVE FOREIGN KEY (USU_EVE_FK_EVE_ID) REFERENCES EVENTO(EVE_ID)
);

CREATE TABLE notificaciones(
NOT_ID serial,
endpoint VARCHAR(400) UNIQUE,
expiration_time float,
p256dh VARCHAR(400),
auth VARCHAR(400),
email VARCHAR(100)
)

create or replace procedure Not_suscribir(
   endpoint VARCHAR(400),
   time_exp FLOAT, 
   p256dh VARCHAR(400),
   auth VARCHAR(400)
)
LANGUAGE SQL   
as $$

INSERT INTO notificaciones (endpoint,expiration_time,p256dh,auth) values(endpoint,time_exp,p256dh,auth)
$$
