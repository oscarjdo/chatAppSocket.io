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
    answeredMessage text default null,
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

create table featured_messages(
	id int not null auto_increment primary key,
    user_id int not null,
    message_id int not null,
    conversation_id int not null,
    foreign key (user_id) references users (id),
    foreign key (message_id) references messages (message_id),
    foreign key (conversation_id) references conversation (conversation_id)
);

alter table featured_messages add column conversation_id int not null,
	add foreign key featured_messages (conversation_id) references conversation (conversation_id);
    
alter table featured_messages drop column conversation_id;

alter table featured_messages add column message_sender int not null,
	add foreign key (message_sender) references users (id);

-- delete from featured_messages where id >= 0;
select * from messages;
select * from users;
select * from conversation;
select * from conversation_members;
select * from featured_messages;

select fm.message_id, fm.user_id, fm.conversation_id, u.img_url img_url_user,
	c.img_url img_url_group, c.group_name, c.isGroup, u.username, m.content,
	m.user_id sender, us.username senderUsername from featured_messages fm
      left join users u on u.id = fm.user_id
      left join messages m on m.message_id = fm.message_id
      left join users us on us.id = m.user_id
      left join conversation c on c.conversation_id = fm.conversation_id
      where fm.user_id = 1;
      
select fm.message_id, fm.conversation_id, m.content, m.user_id as senderId,
	us.username, c.isGroup, c.group_name, c.img_url as img_url_group,
	cm.user_id as member, ui.img_url
	from featured_messages fm
	left join messages m on m.message_id = fm.message_id
    left join conversation c on c.conversation_id = fm.conversation_id
    left join conversation_members cm on cm.conversation_id = fm.conversation_id and c.isGroup = false
    left join users ui on ui.id = cm.user_id
    left join users us on  us.id = m.user_id
	where fm.user_id = 1 and cm.user_id != 1 or cm.user_id is null;