drop schema if exists cccat17 cascade;

create schema cccat17;

create table cccat17.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	password text not null,
	password_type text not null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
	car_plate text null,
);
