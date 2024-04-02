create database chatApp;
use chatApp;
drop database chatApp;

create table users (
	id int not null auto_increment,
    username varchar(255) not null,
    email varchar(255) unique not null,
    img_url varchar(255) default null,
    password varchar(255) not null,
    primary key (id)
);

create table friend_list (
	friendship_id int not null auto_increment,
    user_id int not null,
    friend_id int not null,
    primary key (friendship_id),
    foreign key (user_id) references users (id),
    foreign key (friend_id) references users (id)
);

create table friend_request (
	request_id int not null auto_increment,
    request_sender_id int not null,
    request_reciever_id int not null,
    primary key (request_id),
    foreign key (request_sender_id) references users (id),
    foreign key (request_reciever_id) references users (id)
);

create table conversation (
	conversation_id int not null auto_increment,
    isGroup boolean default false,
    img_url varchar(255) default null,
    group_name varchar(25),
    group_description varchar(255),
    last_interaction datetime not null,
    primary key (conversation_id)
);

alter table conversation add column last_interaction datetime;
update conversation set last_interaction = now() where conversation_id > 0;

create table conversation_members (
	member_id int not null auto_increment,
    conversation_id int not null,
    user_id int not null,
    isInside boolean default true,
    left_group_at datetime default null,
    is_leader boolean default false,
    is_creator boolean default false,
    primary key (member_id),
    foreign key (conversation_id) references conversation(conversation_id),
    foreign key (user_id) references users(id)
);

SET FOREIGN_KEY_CHECKS=0;

create table messages (
	message_id int not null auto_increment primary key,
    conversation_id int not null, 
    user_id int default null,
    content text default null,
    sent_date datetime,
    message_read boolean default false,
    mimetype varchar(20) default null,
    file_url varchar(255) default null,
    answeredMessage int default null,
    event boolean default false,
    foreign key (answeredMessage) references messages (message_id),
    foreign key (conversation_id) references conversation (conversation_id),
    foreign key (user_id) references users (id)
);

create table not_show_messages(
	id int not null auto_increment primary key,
    message_id int not null,
    user_id int not null,
    is_show boolean default true,
    deleted boolean default false,
    conversation_id int not null,
    foreign key (message_id) references messages (message_id),
    foreign key (user_id) references users (id)
);