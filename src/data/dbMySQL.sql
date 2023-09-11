--MySQL / MariaDB

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(255),
  `cpf` varchar(255),
  `typeUser` int,
  `phone` varchar(255),
  `password` varchar(255),
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `address` (
  `id` int,
  `user_id` int,
  `complement` varchar(255),
  `number` int,
  `cep` varchar(255),
  `city_id` int,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `city` (
  `id` int,
  `state_id` int,
  `name` varchar(255),
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `state` (
  `id` int,
  `name` varchar(255),
  `uf` varchar(255),
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `product` (
  `id` int,
  `category_id` int,
  `name` varchar(255),
  `price` double,
  `image` varcharc,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `category` (
  `id` int,
  `name` varchar(255),
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `order` (
  `id` int,
  `user_id` int,
  `address_id` int,
  `date` timestamp,
  `payment_id` int,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `cart` (
  `id` int,
  `user_id` int,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `cart_product` (
  `id` int,
  `cart_id` int,
  `product_id` int,
  `amount` int,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `order_product` (
  `id` int,
  `order_id` int,
  `product_id` int,
  `amount` int,
  `price` double,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `payment` (
  `id` int,
  `status_id` int,
  `price` double,
  `discount` double,
  `final_price` double,
  `payment_pix_id` int,
  `payment_credit_card_id` int,
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `status` (
  `id` int,
  `name` varchar(255),
  `created_at` timestamp,
  `updatedd_at` timestamp
);

CREATE TABLE `payment_pix` (
  `id` int,
  `code` varchar(255),
  `date_payment` timestamp
);

CREATE TABLE `payment_credit_card` (
  `id` int,
  `installments` int
);

ALTER TABLE `address` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `city` ADD FOREIGN KEY (`state_id`) REFERENCES `state` (`id`);

ALTER TABLE `address` ADD FOREIGN KEY (`city_id`) REFERENCES `city` (`id`);

ALTER TABLE `product` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`address_id`) REFERENCES `address` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `order_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `cart_product` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `cart_product` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`status_id`) REFERENCES `status` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`payment_pix_id`) REFERENCES `payment_pix` (`id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`payment_credit_card_id`) REFERENCES `payment_credit_card` (`id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
