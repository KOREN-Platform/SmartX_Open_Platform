CREATE TABLE Slicing (
Slicing_ID VARCHAR(100) NOT NULL,
Tenant_ID VARCHAR(100) Not NULL,
Authority VARCHAR(100) Not NULL,
VLAN_ID VARCHAR (100) Not NULL,
PRIMARY KEY(Slicing_ID)
);

CREATE TABLE Instance (
Instance_ID VARCHAR (100) NOT NULL,
IP VARCHAR (100) NOT NULL,
PRIMARY KEY(Instance_ID)
);

CREATE TABLE IoT (
MAC VARCHAR (100) NOT NULL,
IP VARCHAR (100) NOT NULL,
PRIMARY KEY(MAC)
);

CREATE TABLE Slicing_Instance (
Slicing_ID VARCHAR (100) NOT NULL,
Instance_ID VARCHAR (100) NOT NULL,
PRIMARY KEY (Slicing_ID, Instance_ID),
FOREIGN KEY (Slicing_ID) references Slicing(Slicing_ID),
FOREIGN KEY (Instance_ID) references Instance(Instance_ID)
);

CREATE TABLE Slicing_IoT (
Slicing_ID VARCHAR (100) NOT NULL,
MAC VARCHAR (100) NOT NULL,
PRIMARY KEY (Slicing_ID, MAC),
FOREIGN KEY (Slicing_ID) references Slicing(Slicing_ID),
FOREIGN KEY (MAC) references IoT(MAC)
);


