create schema estore;

create table estore.categories (
    id int not null,
    category varchar(45) default null,
    parent_category_id int default null,
    primary key (id)
);

insert into
    estore.categories (id, category, parent_category_id)
values
    (1, 'Men', null),
    (2, 'Women', null),
    (3, 'Kids', null),
    (4, 'Casual Wear', 1),
    (5, 'Party Wear', 2),
    (6, 'Foot Wear', 2),
    (7, 'Accessories', 3);

create table estore.products (
    id int not null,
    name varchar(45) default null,
    image varchar(45),
    description varchar(100) default null,
    price decimal(10, 0) default null,
    rating int default null,
    category_id int default null,
    primary key (id),
    Key FK_Products_Categories_id(category_id),
    constraint FK_Products_Categories_id foreign key (category_id) references estore.categories (id) on update cascade on delete cascade
);

insert into
    estore.products (
        id,
        name,
        description,
        price,
        rating,
        category_id,
        image
    )
values
    (
        1,
        'Jacket',
        'Fine Jacker with high quality material',
        100,
        5,
        4.5,
        'shop-1.jpg'
    ),
    (
        2,
        'Purse',
        'Very nice purse',
        25,
        3,
        7,
        'shop-2.jpg'
    ),
    (
        3,
        'Dress',
        'Nice party dress',
        45,
        4,
        5,
        'shop-3.jpg'
    ),
    (
        4,
        'Denim Jeans',
        'Denim Jeans',
        50,
        4,
        4,
        'shop-4.jpg'
    ),
    (
        5,
        'Laced Boots',
        'Premium leather boots',
        65,
        4,
        6,
        'shop-5.jpg'
    ),
    (
        6,
        'Back pack',
        'Spacious back pack',
        20,
        5,
        7,
        'shop-6.jpg'
    ),
    (
        7,
        'Ear rings',
        'Beautiful ear rings',
        10,
        4,
        7,
        'shop-7.jpg'
    ),
    (
        8,
        'Scarf',
        'Matching scarf',
        30,
        4,
        7,
        'shop-8.jpg'
    ),
    (
        9,
        'Boots',
        'Black leather boots',
        70,
        4.5,
        6,
        'shop-9.jpg'
    );

alter table
    estore.products
add
    column keywords varchar(200) null;

update
    estore.products
set
    keywords = 'jacket,woolen,black'
where
    id = 1;

update
    estore.products
set
    keywords = 'bag,purse,leather,black'
where
    id = 2;

update
    estore.products
set
    keywords = 'dress,party,frock'
where
    id = 3;

update
    estore.products
set
    keywords = 'denim,jeans,casual,pant'
where
    id = 4;

update
    estore.products
set
    keywords = 'boots,laced,yellow'
where
    id = 5;

update
    estore.products
set
    keywords = 'leather,black,bag'
where
    id = 6;

update
    estore.products
set
    keywords = 'ear,rings,blue,golden'
where
    id = 7;

update
    estore.products
set
    keywords = 'scarf,chocolate,party'
where
    id = 8;

update
    estore.products
set
    keywords = 'leather,black,boots'
where
    id = 9;

create table estore.users (
    id int not null auto_increment,
    email varchar(45) not null,
    first_name varchar(45) default null,
    last_name varchar(45) default null,
    address varchar(200) default null,
    city varchar(45) default null,
    state varchar(45) default null,
    pin varchar(10) default null,
    password varchar(500) default null,
    primary key(id)
);

CREATE TABLE `orders` (
    `id` int NOT NULL AUTO_INCREMENT,
    `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
    `user_name` varchar(100) DEFAULT NULL,
    `address` varchar(200) DEFAULT NULL,
    `city` varchar(45) DEFAULT NULL,
    `state` varchar(45) DEFAULT NULL,
    `pin` varchar(10) DEFAULT NULL,
    `total` decimal(10, 0) DEFAULT NULL,
    `user_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_User_idx` (`user_id`),
    CONSTRAINT `FK_User` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `order_details` (
    `order_id` int NOT NULL,
    `product_id` int DEFAULT NULL,
    `quantity` int DEFAULT NULL,
    `price` decimal(10, 0) DEFAULT NULL,
    `amount` decimal(10, 0) DEFAULT NULL,
    KEY `FK_order_id_idx` (`order_id`),
    KEY `FK_product_id_idx` (`product_id`),
    CONSTRAINT `FK_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
    CONSTRAINT `FK_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
);