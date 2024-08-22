drop schema if exists cccat17 cascade;

create schema cccat17;

create table cccat17.transaction (
	transaction_id uuid primary key,
	ride_id uuid,
	amount numeric,
	date timestamp,
	status text
);