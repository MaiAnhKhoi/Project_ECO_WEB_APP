-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2025 at 05:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tlcn_demo`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_tokens`
--

CREATE TABLE `access_tokens` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token_hash` varchar(255) NOT NULL COMMENT 'Hash của JWT token',
  `token_type` varchar(20) NOT NULL DEFAULT 'bearer',
  `scope` varchar(255) DEFAULT NULL COMMENT 'Phạm vi quyền',
  `expires_at` datetime NOT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `access_tokens`
--

INSERT INTO `access_tokens` (`id`, `user_id`, `token_hash`, `token_type`, `scope`, `expires_at`, `ip_address`, `user_agent`, `created_at`, `revoked_at`) VALUES
(1, 25, '72d40f2c8bc404de7d27e47aa83ce6baacb17a23abd3ecf6790584b53ed83e84', 'bearer', NULL, '2025-11-27 19:29:28', NULL, NULL, '2025-11-27 18:29:28', NULL),
(2, 25, '1d0640e9d63b29fdbf6729fc1cdb090b96c2c4746986d69230d37e1d5c2e888f', 'bearer', NULL, '2025-11-27 20:52:02', NULL, NULL, '2025-11-27 19:52:02', NULL),
(3, 25, '86587991e6d0b4b1e1db477e5fe837fe14eba06b85c751940f1ff998c61c3b37', 'bearer', NULL, '2025-11-27 21:02:34', NULL, NULL, '2025-11-27 20:02:34', NULL),
(4, 25, '716f2b0f3950297b027e6aab8406ed3503d354ed46ba65e6ffe82f8dc5e8c0ad', 'bearer', NULL, '2025-11-27 21:03:08', NULL, NULL, '2025-11-27 20:03:08', NULL),
(5, 25, '6afdcb2593974507f2cbb42789ff38b8aa992bc4537b43e91c240eb58c825f05', 'bearer', NULL, '2025-11-27 21:26:47', NULL, NULL, '2025-11-27 20:26:47', NULL),
(6, 25, '6e048fab914a51feb0aa2993e6f2ea525157d726af625db07a3578851d736800', 'bearer', NULL, '2025-11-27 21:43:32', NULL, NULL, '2025-11-27 20:43:32', NULL),
(7, 25, '034677fa7067f3e6ebd26dc25f8062cf29443c1d640faf627b0cba054e329d69', 'bearer', NULL, '2025-11-27 22:02:31', NULL, NULL, '2025-11-27 21:02:31', NULL),
(8, 25, '1978efe4e7f94b61a41f012c87e85a8f009f3adefb4d93b6adc7864798652955', 'bearer', NULL, '2025-11-27 22:03:13', NULL, NULL, '2025-11-27 21:03:13', NULL),
(9, 25, '7a591f03d18763926bda71d6386da849a71cb143c1cc7a7235948020f949ab09', 'bearer', NULL, '2025-11-27 22:06:31', NULL, NULL, '2025-11-27 21:06:31', NULL),
(10, 25, '59acb066a9d53cc76b6fd3485d927f72015d1e7518fc31b00a4427278e8970d9', 'bearer', NULL, '2025-11-27 22:06:53', NULL, NULL, '2025-11-27 21:06:53', NULL),
(11, 25, '340c5ce7db266695e4ac2b9d2c10e1a52d875146426b2677487b668f4360a1d4', 'bearer', NULL, '2025-11-27 23:11:47', NULL, NULL, '2025-11-27 22:11:47', NULL),
(12, 25, 'ff0052ab932293f678ad06d3aaaecc808dc9533c3831adfd346f064605bf9744', 'bearer', NULL, '2025-11-28 01:54:54', NULL, NULL, '2025-11-28 00:54:54', NULL),
(13, 18, 'b3715f9427b1c7207b306036ed84a4a47fc74698540d50bd76c95fa2f9c98c29', 'bearer', NULL, '2025-11-28 02:19:12', NULL, NULL, '2025-11-28 01:19:12', NULL),
(14, 18, 'e43db93de368582d40e5e1b0077ef0516bcca9a77fadd0044884b4faae964e15', 'bearer', NULL, '2025-11-28 03:20:22', NULL, NULL, '2025-11-28 02:20:22', NULL),
(15, 25, 'd0c0700d61e8847236bf4add444859349c45514c5690f95fb6b79b3cdaf2800e', 'bearer', NULL, '2025-11-28 15:27:34', NULL, NULL, '2025-11-28 14:27:34', NULL),
(16, 18, 'da0d53d625746c00bae7b38f2e805b84b4fabd04f3aa310d352db15af8db9fe1', 'bearer', NULL, '2025-11-28 16:37:44', NULL, NULL, '2025-11-28 15:37:44', NULL),
(17, 18, 'dbe6cc34eb118098c7f0365c5bde0ceb418a62fef16c6d8361972a8bb4a1b105', 'bearer', NULL, '2025-11-28 17:44:39', NULL, NULL, '2025-11-28 16:44:39', NULL),
(18, 18, '87e140d33315a52ad8dcadd7c9263d128f3e1a477c65e3271fb5330ae1018225', 'bearer', NULL, '2025-11-28 18:45:24', NULL, NULL, '2025-11-28 17:45:24', NULL),
(19, 18, '3944b6b3c17c3dc6ea11df4d56953467d1f76b9c10887ace98118be00e2116f1', 'bearer', NULL, '2025-11-29 10:37:57', NULL, NULL, '2025-11-29 09:37:57', NULL),
(20, 18, 'e768d984618c118d35dc8e452d06fddce56eb47a31d6d5613a76ba9efd0cd360', 'bearer', NULL, '2025-11-29 19:00:55', NULL, NULL, '2025-11-29 18:00:55', NULL),
(21, 18, 'fcf2b5598ce85adef7565f4e56cecc713523a8902e2e20f6de564fe18a30c2d8', 'bearer', NULL, '2025-11-30 03:38:42', NULL, NULL, '2025-11-30 02:38:42', NULL),
(22, 18, '968e6f9659ce5d127f42ebd57c68e262c1373e7ac6a12c5276f96a24f7482868', 'bearer', NULL, '2025-11-30 03:42:02', NULL, NULL, '2025-11-30 02:42:02', NULL),
(23, 106, '66512f6f61f43fec13de0fd839d8faa1a4ed2ab633caf44bb078b76959ec71ff', 'bearer', NULL, '2025-11-30 03:43:27', NULL, NULL, '2025-11-30 02:43:27', NULL),
(24, 18, '9fcad7b6bcec91f0fd7625af6425d1a803b71428ca93f1a7401f5f1e0286075d', 'bearer', NULL, '2025-11-30 03:43:47', NULL, NULL, '2025-11-30 02:43:47', NULL),
(25, 106, 'bb0daef35500ad59e8a12237979d543e20d01e1caf13687424996e3cb3b00934', 'bearer', NULL, '2025-11-30 03:44:26', NULL, NULL, '2025-11-30 02:44:26', NULL),
(26, 18, '1c159e0675c0ab0a675c4c753af9c75efa3fd856b62b3bfa25814484c8e89dc8', 'bearer', NULL, '2025-11-30 03:44:45', NULL, NULL, '2025-11-30 02:44:45', NULL),
(27, 108, 'f555f4625be3e8d67e7bd4a0c52e18639649289d8ff3cd55e3cadb35318074fd', 'bearer', NULL, '2025-11-30 03:47:04', NULL, NULL, '2025-11-30 02:47:04', NULL),
(28, 18, 'f2d4488b761b13bd659f5baeaac8cf3fb9e149ca2c872de58e63a7368b2b09aa', 'bearer', NULL, '2025-11-30 05:11:38', NULL, NULL, '2025-11-30 04:11:38', NULL),
(29, 23, '516655c64ffe8114c9ec7131cb177b8c3b2bcb09dc51abc27a8fcc42e50b28f0', 'bearer', NULL, '2025-11-30 05:30:37', NULL, NULL, '2025-11-30 04:30:37', NULL),
(30, 23, 'c38a75318dd0efa67e4d0cc8a0aa4f37adb23d2f34c61176349e858bd2c2e2a4', 'bearer', NULL, '2025-11-30 05:41:58', NULL, NULL, '2025-11-30 04:41:58', NULL),
(31, 23, '3611ca96ec9409fade6c8c0ea010a5945e45b57b81b33fd055192fdd1ff57f4b', 'bearer', NULL, '2025-12-02 01:17:46', NULL, NULL, '2025-12-02 00:17:46', NULL),
(32, 23, '11d0da30c6a749bff2be4e0cf81f2a212eb2423425f5ebf471e28e3075ae78af', 'bearer', NULL, '2025-12-02 02:00:34', NULL, NULL, '2025-12-02 01:00:34', NULL),
(33, 23, '24c424e58f2cdc0f71ef7c64099a8d65c986e1f44cfc595fea7fa8f43342a98b', 'bearer', NULL, '2025-12-02 03:01:42', NULL, NULL, '2025-12-02 02:01:42', NULL),
(34, 18, '50ddc336336aa86b49c74d97d65e1f96397f2e38b9d5f3f0aeebda82e97b6783', 'bearer', NULL, '2025-12-06 15:27:58', NULL, NULL, '2025-12-06 14:27:58', NULL),
(35, 23, 'bbf29b316af581490eb24b39ced3ae50358f93222f7f0df057fb5657b820356a', 'bearer', NULL, '2025-12-06 15:28:31', NULL, NULL, '2025-12-06 14:28:31', NULL),
(36, 18, 'cd8ff19b8e499cd405cc72a356e77f5321ebbfcb6423928595a1a71bafcf50a3', 'bearer', NULL, '2025-12-06 16:59:40', NULL, NULL, '2025-12-06 15:59:40', NULL),
(37, 18, 'c3d8fd6a10541814cfd1191c491e64cbc0cfbda474f95425c96cef16779e6cd4', 'bearer', NULL, '2025-12-06 18:49:02', NULL, NULL, '2025-12-06 17:49:02', NULL),
(38, 23, '019da6b3f3f50330dcf8ae3b460e4d71768f68989f26fce2175f17a86aeef0e5', 'bearer', NULL, '2025-12-06 18:49:25', NULL, NULL, '2025-12-06 17:49:25', NULL),
(39, 23, 'd4125ed5f900fe1cbcd8ff24481a6291e2c317496f3dcde99c9456ecf5d0a793', 'bearer', NULL, '2025-12-13 19:17:50', NULL, NULL, '2025-12-06 19:17:50', NULL),
(40, 18, '6669d70d0026fd067c3643d968e5640b133bcd67b85a957ee3195d5f3b09e7de', 'bearer', NULL, '2025-12-13 19:32:13', NULL, NULL, '2025-12-06 19:32:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `receiver` varchar(120) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `line1` varchar(255) NOT NULL,
  `line2` varchar(255) DEFAULT NULL,
  `ward` varchar(120) DEFAULT NULL,
  `district` varchar(120) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `province` varchar(120) DEFAULT NULL,
  `country` varchar(120) NOT NULL DEFAULT 'VN',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `receiver`, `phone`, `line1`, `line2`, `ward`, `district`, `city`, `province`, `country`, `is_default`, `created_at`) VALUES
(1, 18, 'Khôi Mai Anh', '0332777154', '123 Đường ABC', 'Chung cư XYZ', 'Phường 1', 'Quận 1', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'VN', 1, '2025-11-19 08:15:00'),
(2, 18, 'Khôi Mai Anh', '0332777154', 'đường 138', 'Sư Phạm Kỹ Thuât', NULL, NULL, 'Thành Phố Hồ Chí Minh', 'TPHCM', 'Hồ Chí Minh', 0, '2025-11-20 22:38:28'),
(3, 23, 'Khôi Mai Anh', '0332777154', 'đường 138', 'Sư Phạm Kỹ Thuât', NULL, NULL, 'Thành Phố Hồ Chí Minh', 'TPHCM', 'Hồ Chí Minh', 1, '2025-11-26 23:26:17'),
(4, 25, 'Ngoc Huy Nguyen', '0327793283', 'Binh Dinh', 'NNH', NULL, NULL, 'Binh Dinh', 'Binh Dinh', 'TP.HCM', 1, '2025-11-27 21:42:53');

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `sort_order` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`id`, `name`, `created_at`, `type`, `code`, `sort_order`) VALUES
(1, 'Màu sắc', '2025-11-19 08:00:00', 'color', 'COLOR', 1),
(2, 'Size áo/quần', '2025-11-19 08:00:00', 'size', 'SIZE', 2),
(3, 'Size giày', '2025-11-19 08:00:00', 'size', 'SHOE_SIZE', 3);

-- --------------------------------------------------------

--
-- Table structure for table `attribute_values`
--

CREATE TABLE `attribute_values` (
  `id` bigint(20) NOT NULL,
  `attribute_id` bigint(20) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 1,
  `code` varchar(50) NOT NULL,
  `color_css_class` varchar(50) DEFAULT NULL,
  `color_hex` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attribute_values`
--

INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`, `sort_order`, `code`, `color_css_class`, `color_hex`) VALUES
(1, 1, 'Đen', 1, 'BLACK', 'bg-secondary-900', '#131517'),
(2, 1, 'Trắng', 2, 'White', 'bg-white', '#ffffff'),
(3, 1, 'Xanh navy', 3, '', 'bg-primary-400', '#3d8bfd'),
(4, 2, 'S', 1, 'S', NULL, NULL),
(5, 2, 'M', 2, 'M', NULL, NULL),
(6, 2, 'L', 3, 'L', NULL, NULL),
(7, 3, '40', 1, '40', NULL, NULL),
(8, 3, '41', 2, '41', NULL, NULL),
(9, 3, '42', 3, '42', NULL, NULL),
(10, 1, 'Xám', 4, 'GRAY', 'bg-gray-600', '#4b5563'),
(11, 1, 'Xám nhạt', 5, 'LIGHT_GRAY', 'bg-gray-200', '#e5e7eb'),
(12, 1, 'Be', 6, 'BEIGE', 'bg-amber-100', '#fef3c7'),
(13, 1, 'Nâu', 7, 'BROWN', 'bg-amber-700', '#92400e'),
(14, 1, 'Đỏ', 8, 'RED', 'bg-red-500', '#ef4444'),
(15, 1, 'Đỏ đô', 9, 'MAROON', 'bg-red-800', '#991b1b'),
(16, 1, 'Vàng', 10, 'YELLOW', 'bg-yellow-400', '#facc15'),
(17, 1, 'Xanh lá', 11, 'GREEN', 'bg-green-500', '#22c55e'),
(18, 1, 'Xanh lá đậm', 12, 'FOREST', 'bg-emerald-700', '#047857'),
(19, 1, 'Xanh dương', 13, 'BLUE', 'bg-blue-500', '#3b82f6'),
(20, 1, 'Xanh pastel', 14, 'MINT', 'bg-emerald-300', '#6ee7b7'),
(21, 1, 'Hồng', 15, 'PINK', 'bg-pink-400', '#f472b6'),
(22, 1, 'Tím', 16, 'PURPLE', 'bg-purple-500', '#a855f7'),
(23, 2, 'XS', 0, 'XS', NULL, NULL),
(24, 2, 'XL', 4, 'XL', NULL, NULL),
(25, 2, '2XL', 5, '2XL', NULL, NULL),
(26, 2, '3XL', 6, '3XL', NULL, NULL),
(27, 2, 'One size', 7, 'ONE_SIZE', NULL, NULL),
(28, 3, '36', 0, '36', NULL, NULL),
(29, 3, '37', 1, '37', NULL, NULL),
(30, 3, '38', 2, '38', NULL, NULL),
(31, 3, '39', 3, '39', NULL, NULL),
(32, 3, '43', 4, '43', NULL, NULL),
(33, 3, '44', 5, '44', NULL, NULL),
(34, 3, '45', 6, '45', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image_url`, `link_url`, `position`, `active`, `created_at`) VALUES
(1, '', 'https://intphcm.com/data/upload/poster-giay-ad.jpg', NULL, 'home', 1, '2025-11-19 16:40:19'),
(2, '', 'https://intphcm.com/data/upload/banner-thoi-trang-nam.jpg', NULL, 'home', 1, '2025-11-19 16:40:19'),
(3, '', 'https://cdn.dribbble.com/userupload/13118950/file/original-cfaebacb75910a02e08e618b7ab2a067.jpg?resize=752x&vertical=center', NULL, 'home', 1, '2025-11-19 16:40:19');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` bigint(20) NOT NULL,
  `title` varchar(500) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `content` longtext DEFAULT NULL,
  `excerpt` varchar(1000) DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `author_id` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'draft',
  `view_count` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `published_at` datetime DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `content`, `excerpt`, `featured_image`, `author_id`, `category`, `tags`, `status`, `view_count`, `created_at`, `updated_at`, `published_at`, `category_id`) VALUES
(1, 'Xu hướng thời trang mùa xuân 2025', 'xu-huong-thoi-trang-mua-xuan-2025', '<h2>Xu hướng thời trang mùa xuân 2025</h2><p>Mùa xuân 2025 mang đến những xu hướng thời trang mới mẻ và độc đáo. Từ màu sắc pastel nhẹ nhàng đến các họa tiết hoa lá tươi mới, thời trang mùa xuân năm nay hứa hẹn sẽ làm bừng sáng tủ đồ của bạn.</p><h3>Màu sắc chủ đạo</h3><p>Các tông màu pastel như hồng phấn, xanh mint, và vàng nhạt sẽ là xu hướng nổi bật. Ngoài ra, màu be và trắng vẫn luôn là lựa chọn an toàn cho mọi dịp.</p><h3>Chất liệu</h3><p>Vải cotton, linen và các chất liệu tự nhiên được ưa chuộng nhờ tính thông thoáng, phù hợp với thời tiết mùa xuân.</p>', 'Khám phá những xu hướng thời trang nổi bật nhất mùa xuân 2025', 'https://images.unsplash.com/photo-1483985988355-763728e1935b', 18, 'Fashion Trends', 'thời trang,xu hướng,mùa xuân', 'published', 150, '2025-11-01 10:00:00', '2025-11-01 10:00:00', '2025-11-01 10:00:00', NULL),
(2, 'Cách phối đồ với áo thun basic', 'cach-phoi-do-voi-ao-thun-basic', '<h2>Cách phối đồ với áo thun basic</h2><p>Áo thun basic là món đồ không thể thiếu trong tủ đồ của bạn. Với sự đơn giản và dễ phối, áo thun basic có thể kết hợp với nhiều trang phục khác nhau để tạo nên phong cách riêng.</p><h3>Phối với quần jean</h3><p>Đây là combo kinh điển và không bao giờ lỗi mốt. Một chiếc áo thun trắng kết hợp với quần jean xanh tạo nên vẻ ngoài trẻ trung, năng động.</p><h3>Phối với chân váy</h3><p>Áo thun basic + chân váy midi hoặc maxi tạo nên vẻ nữ tính, thanh lịch. Thêm một đôi giày cao gót và bạn đã có outfit hoàn hảo cho ngày hẹn hò.</p><h3>Phối với quần tây</h3><p>Muốn trông chuyên nghiệp hơn? Hãy thử kết hợp áo thun với quần tây và blazer. Phong cách này vừa lịch sự vừa thoải mái.</p>', 'Hướng dẫn chi tiết cách phối đồ với áo thun basic', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 18, 'Style Guide', 'áo thun,phối đồ,style', 'published', 89, '2025-11-05 14:30:00', '2025-11-26 15:00:34', '2025-11-05 14:30:00', 5),
(3, 'Chọn giày sneaker phù hợp với dáng người', 'chon-giay-sneaker-phu-hop-voi-dang-nguoi', '<h2>Chọn giày sneaker phù hợp</h2><p>Giày sneaker không chỉ thoải mái mà còn thể hiện phong cách cá nhân của bạn. Tuy nhiên, không phải mẫu giày nào cũng phù hợp với mọi dáng người.</p><h3>Dáng người cao gầy</h3><p>Bạn có thể tự tin lựa chọn các mẫu giày có đế cao hoặc chunky sneaker để tạo sự cân đối cho cơ thể.</p><h3>Dáng người thấp</h3><p>Nên chọn giày có đế cao nhẹ hoặc giày có màu sáng để tạo cảm giác chân dài hơn. Tránh giày quá chunky vì sẽ làm bạn trông thấp hơn.</p><h3>Dáng người mũm mĩm</h3><p>Low-top sneaker với thiết kế đơn giản sẽ giúp bạn trông thon gọn hơn. Tránh các mẫu giày quá bản to hoặc có nhiều chi tiết rườm rà.</p>', 'Tìm hiểu cách chọn giày sneaker phù hợp với dáng người của bạn', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2', 18, 'Fashion Tips', 'giày sneaker,thời trang,mẹo', 'published', 120, '2025-11-10 09:00:00', '2025-11-26 15:00:34', '2025-11-10 09:00:00', 5),
(5, 'Cách Chọn Kính Râm Phù Hợp Với Khuôn Mặt', 'cach-chon-kinh-ram-phu-hop-voi-khuon-mat', '<h2>Cách Chọn Kính Râm Phù Hợp</h2><p>Mỗi khuôn mặt có đặc điểm riêng, việc chọn kính râm phù hợp sẽ giúp tôn lên nét đẹp tự nhiên.</p><h3>Mặt tròn</h3><p>Nên chọn gọng vuông hoặc chữ nhật để tạo góc cạnh, cân bằng khuôn mặt.</p><h3>Mặt vuông</h3><p>Gọng tròn hoặc oval sẽ làm mềm mại đường nét góc cạnh.</p><h3>Mặt trái xoan</h3><p>Khuôn mặt lý tưởng, có thể đeo hầu hết các kiểu gọng kính.</p>', 'Hướng dẫn chi tiết cách chọn kính râm phù hợp với từng khuôn ', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764269722/blogs/pxr2sgqt4dfv13gu7sh9.jpg', 18, NULL, 'kính râm,phụ kiện,thời trang', 'published', 189, '2025-11-26 15:12:44', '2025-11-28 01:55:23', '2025-11-26 15:12:44', 1),
(6, '5 Kiểu Túi Xách Đang Hot Trend 2025', '5-kieu-tui-xach-dang-hot-trend-2025', '<h2>5 Kiểu Túi Xách Hot Trend 2025</h2><p>Năm 2025 chứng kiến sự trở lại của nhiều phong cách túi xách đa dạng.</p><h3>1. Túi Hobo</h3><p>Thiết kế hình bán nguyệt, rộng rãi, phù hợp cho phong cách bohemian, tự do.</p><h3>2. Túi Mini Bag</h3><p>Túi nhỏ gọn, tiện dụng cho các buổi tiệc hay dạo phố.</p><h3>3. Túi Tote</h3><p>Đơn giản nhưng luôn thời thượng, phù hợp mọi lứa tuổi.</p><h3>4. Túi Saddle</h3><p>Thiết kế hình yên ngựa độc đáo, cá tính.</p><h3>5. Túi Belt Bag</h3><p>Túi đeo hông tiện lợi, phong cách thể thao năng động.</p>', 'Cập nhật 5 kiểu túi xách được yêu thích nhất trong năm 2025', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 18, NULL, 'túi xách,xu hướng,2025', 'published', 312, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 2),
(7, 'Bí Quyết Chọn Túi Xách Công Sở Sang Trọng', 'bi-quyet-chon-tui-xach-cong-so-sang-trong', '<h2>Bí Quyết Chọn Túi Xách Công Sở</h2><p>Túi xách công sở không chỉ cần đẹp mà còn phải thực dụng và chuyên nghiệp.</p><h3>Chất liệu</h3><p>Ưu tiên da thật hoặc da tổng hợp cao cấp, bền đẹp và sang trọng.</p><h3>Màu sắc</h3><p>Các tông màu trung tính: đen, nâu, be, xám - dễ phối đồ và luôn thanh lịch.</p><h3>Kích thước</h3><p>Đủ rộng để đựng laptop, tài liệu nhưng không quá cồng kềnh.</p><h3>Thiết kế</h3><p>Đơn giản, tối giản, tránh quá nhiều chi tiết rườm rà.</p>', 'Hướng dẫn chọn túi xách công sở phù hợp và chuyên nghiệp', 'https://images.unsplash.com/photo-1564422170194-896b89110ef8', 18, NULL, 'túi xách,công sở,chuyên nghiệp', 'published', 167, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 2),
(8, 'Nghệ Thuật Sống Tối Giản - Minimalism Lifestyle', 'nghe-thuat-song-toi-gian-minimalism', '<h2>Nghệ Thuật Sống Tối Giản</h2><p>Minimalism không chỉ là phong cách thiết kế mà còn là triết lý sống giúp bạn tập trung vào những gì quan trọng.</p><h3>Tủ quần áo tối giản</h3><p>Chỉ giữ lại những món đồ bạn thực sự yêu thích và sử dụng thường xuyên. Áp dụng quy tắc \"one in, one out\" - mua mới 1 món thì loại bỏ 1 món cũ.</p><h3>Lợi ích</h3><p>Tiết kiệm thời gian chọn đồ buổi sáng, tiết kiệm tiền bạc, và giảm stress do quá nhiều lựa chọn.</p><h3>Capsule Wardrobe</h3><p>Tạo tủ đồ với 30-40 món đồ cơ bản có thể mix-match linh hoạt.</p>', 'Khám phá phong cách sống tối giản và cách áp dụng vào tủ quần áo', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b', 18, NULL, 'minimalism,phong cách sống,tối giản', 'published', 428, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 3),
(9, 'Du Lịch Và Thời Trang: Cách Đóng Gói Hành Lý Thông Minh', 'du-lich-va-thoi-trang-cach-dong-goi-hanh-ly', '<h2>Cách Đóng Gói Hành Lý Thông Minh</h2><p>Du lịch thông minh bắt đầu từ việc đóng gói hành lý khéo léo.</p><h3>Nguyên tắc 5-4-3-2-1</h3><p>5 bộ (dưới + trên), 4 áo thun, 3 váy/quần, 2 đôi giày, 1 mũ. Đủ cho chuyến đi 1 tuần.</p><h3>Chọn màu trung tính</h3><p>Đen, trắng, be, xám - dễ phối và không bị sặc sỡ.</p><h3>Cuộn thay vì gấp</h3><p>Cuộn quần áo giúp tiết kiệm không gian và ít bị nhăn.</p><h3>Phụ kiện</h3><p>Khăn choàng và trang sức nhỏ gọn có thể thay đổi hoàn toàn outfit.</p>', 'Mẹo đóng gói hành lý du lịch thông minh và phong cách', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828', 18, NULL, 'du lịch,hành lý,thời trang', 'published', 298, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 3),
(10, 'Màu Sắc Trong Thiết Kế Thời Trang - Tâm Lý Học Màu', 'mau-sac-trong-thiet-ke-thoi-trang', '<h2>Tâm Lý Học Màu Trong Thời Trang</h2><p>Màu sắc có ảnh hưởng mạnh mẽ đến tâm trạng và cách người khác nhìn nhận bạn.</p><h3>Đỏ</h3><p>Mạnh mẽ, tự tin, thu hút sự chú ý. Phù hợp cho các sự kiện quan trọng.</p><h3>Xanh dương</h3><p>Tin cậy, chuyên nghiệp, bình tĩnh. Lý tưởng cho môi trường công sở.</p><h3>Vàng</h3><p>Vui vẻ, lạc quan, năng động. Tạo cảm giác ấm áp và thân thiện.</p><h3>Đen</h3><p>Sang trọng, thanh lịch, bí ẩn. Màu vạn năng cho mọi dịp.</p>', 'Hiểu về tâm lý học màu sắc để chọn trang phục phù hợp', 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3', 18, NULL, 'màu sắc,thiết kế,tâm lý học', 'published', 356, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 4),
(11, 'Xu Hướng Thiết Kế Thời Trang Bền Vững', 'xu-huong-thiet-ke-thoi-trang-ben-vung', '<h2>Thời Trang Bền Vững</h2><p>Sustainable fashion đang trở thành xu hướng toàn cầu, bảo vệ môi trường và con người.</p><h3>Vật liệu tái chế</h3><p>Sử dụng vải từ nhựa tái chế, cotton hữu cơ, vải từ tre...</p><h3>Slow fashion</h3><p>Đầu tư vào những món đồ chất lượng cao, bền lâu thay vì mua nhiều đồ rẻ tiền.</p><h3>Second-hand</h3><p>Mua đồ cũ chất lượng tốt, vừa tiết kiệm vừa thân thiện môi trường.</p><h3>Upcycling</h3><p>Tái chế quần áo cũ thành món đồ mới độc đáo.</p>', 'Tìm hiểu về xu hướng thời trang bền vững và cách góp phần bảo vệ môi trường', 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd', 18, NULL, 'thiết kế,bền vững,môi trường', 'published', 401, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 4),
(12, '10 Mẹo Mix Đồ Cơ Bản Cho Người Mới Bắt Đầu', '10-meo-mix-do-co-ban-cho-nguoi-moi', '<h2>10 Mẹo Mix Đồ Cho Người Mới</h2><p>Bạn mới bắt đầu quan tâm đến thời trang? Dưới đây là những mẹo cơ bản giúp bạn tự tin hơn.</p><h3>1. Quy tắc 3 màu</h3><p>Một outfit không nên có quá 3 màu chính để tránh rối mắt.</p><h3>2. Cân đối tỷ lệ</h3><p>Áo rộng + quần bó, hoặc áo bó + quần rộng để cân bằng.</p><h3>3. Layer thông minh</h3><p>Áo khoác + áo thun + áo sơ mi tạo độ sâu cho outfit.</p><h3>4. Phụ kiện điểm nhấn</h3><p>Một món phụ kiện nổi bật có thể nâng tầm cả bộ đồ.</p>', '10 mẹo mix đồ đơn giản nhưng hiệu quả cho người mới bắt đầu', 'https://images.unsplash.com/photo-1445205170230-053b83016050', 18, NULL, 'mẹo,mix đồ,phối đồ', 'published', 521, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 5),
(13, 'Cách Bảo Quản Quần Áo Để Bền Lâu', 'cach-bao-quan-quan-ao-de-ben-lau', '<h2>Bảo Quản Quần Áo Đúng Cách</h2><p>Quần áo đắt tiền nhưng nếu không biết cách bảo quản, chúng sẽ nhanh hư hỏng.</p><h3>Giặt đúng cách</h3><p>Đọc nhãn mác trước khi giặt. Giặt tay đồ cao cấp, phân loại màu sắc.</p><h3>Phơi khô</h3><p>Không phơi trực tiếp dưới nắng gắt, tránh làm phai màu.</p><h3>Cất giữ</h3><p>Treo áo khoác, áo vest. Gấp áo thun, quần jean. Dùng móc phơi phù hợp.</p><h3>Chống ẩm mốc</h3><p>Sử dụng túi hút ẩm trong tủ, giữ tủ thông thoáng.</p>', 'Hướng dẫn bảo quản quần áo để giữ được lâu và đẹp như mới', 'https://images.unsplash.com/photo-1558769132-cb1aea588c87', 18, NULL, 'bảo quản,giặt giũ,mẹo', 'published', 278, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 5),
(14, 'Trang Sức Vàng Hay Bạc - Chọn Gì Cho Phù Hợp?', 'trang-suc-vang-hay-bac-chon-gi-cho-phu-hop', '<h2>Vàng Hay Bạc?</h2><p>Lựa chọn giữa trang sức vàng và bạc phụ thuộc vào tone da và phong cách cá nhân.</p><h3>Tone da ấm</h3><p>Da vàng, da ngăm đen → Phù hợp với vàng, đồng, rose gold.</p><h3>Tone da lạnh</h3><p>Da trắng hồng, da trắng ngà → Phù hợp với bạc, vàng trắng, platinum.</p><h3>Phong cách</h3><p>Bạc: hiện đại, trẻ trung. Vàng: cổ điển, sang trọng.</p><h3>Mix & Match</h3><p>Có thể kết hợp cả hai nếu biết cách, tạo điểm nhấn độc đáo.</p>', 'Hướng dẫn chọn trang sức vàng hoặc bạc phù hợp với tone da', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', 18, NULL, 'trang sức,phụ kiện,vàng,bạc', 'published', 203, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 1),
(15, 'Xây Dựng Phong Cách Cá Nhân Từ Đâu?', 'xay-dung-phong-cach-ca-nhan-tu-dau', '<h2>Xây Dựng Phong Cách Cá Nhân</h2><p>Phong cách cá nhân là cách bạn thể hiện bản thân qua trang phục. Làm thế nào để tìm ra phong cách riêng?</p><h3>Tìm hiểu bản thân</h3><p>Bạn thích gì? Thoải mái, sang trọng, cá tính hay nữ tính? Lifestyle của bạn ra sao?</p><h3>Tham khảo Icon</h3><p>Tìm những fashion icon có phong cách bạn yêu thích để học hỏi.</p><h3>Thử nghiệm</h3><p>Đừng ngại thử những style mới, qua đó bạn sẽ biết mình thích gì.</p><h3>Tạo signature look</h3><p>Một món đồ hoặc phụ kiện đặc trưng có thể trở thành dấu ấn riêng.</p>', 'Hướng dẫn bước đầu xây dựng phong cách thời trang cá nhân', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b', 18, NULL, 'phong cách,cá nhân,thời trang', 'published', 387, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 3),
(16, 'Cách Làm Sạch Và Bảo Dưỡng Túi Da', 'cach-lam-sach-va-bao-duong-tui-da', '<h2>Bảo Dưỡng Túi Da</h2><p>Túi da là món đầu tư đáng giá, nhưng cần được chăm sóc đúng cách.</p><h3>Làm sạch định kỳ</h3><p>Dùng khăn ẩm lau nhẹ, tránh nước và xà phòng mạnh.</p><h3>Kem dưỡng da</h3><p>Sử dụng kem dưỡng chuyên dụng 3-6 tháng/lần giúp da mềm mại.</p><h3>Bảo quản đúng cách</h3><p>Nhồi giấy vào túi để giữ form, cất trong túi vải ở nơi khô ráo.</p><h3>Tránh ánh nắng</h3><p>Không để túi da dưới ánh nắng trực tiếp, dễ phai màu và nứt.</p>', 'Hướng dẫn chi tiết cách làm sạch và bảo dưỡng túi da đúng cách', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 18, NULL, 'túi da,bảo dưỡng,làm sạch', 'published', 156, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 2),
(17, '7 Thủ Thuật Chụp Ảnh Outfit Đẹp Như Instagram', '7-thu-thuat-chup-anh-outfit-dep-nhu-instagram', '<h2>Chụp Ảnh Outfit Đẹp</h2><p>Muốn ảnh outfit đẹp như influencer? Áp dụng những mẹo sau!</p><h3>1. Ánh sáng tự nhiên</h3><p>Chụp vào golden hour (sáng sớm hoặc chiều muộn) cho ánh sáng mềm mại.</p><h3>2. Background đơn giản</h3><p>Tường trơn, đường phố sạch sẽ giúp outfit nổi bật.</p><h3>3. Góc chụp</h3><p>Chụp từ thấp lên cao để chân dài hơn.</p><h3>4. Tư thế tự nhiên</h3><p>Đừng đứng thẳng cứng, hãy tạo động tác tự nhiên.</p><h3>5. Rule of thirds</h3><p>Đặt người ở 1/3 khung hình, không chính giữa.</p>', 'Bí quyết chụp ảnh outfit đẹp mắt như các fashionista trên Instagram', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', 18, NULL, 'chụp ảnh,instagram,mẹo', 'published', 612, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 5),
(18, 'Lịch Sử Thời Trang: Từ Những Năm 1920 Đến Nay', 'lich-su-thoi-trang-tu-1920-den-nay', '<h2>Lịch Sử Thời Trang</h2><p>Hành trình thời trang qua các thập kỷ phản ánh sự thay đổi của xã hội.</p><h3>1920s - The Roaring Twenties</h3><p>Váy ngắn flapper, đường nét thẳng, phong cách boyish của phụ nữ.</p><h3>1950s - New Look</h3><p>Eo thắt, váy xòe, nữ tính và thanh lịch theo Christian Dior.</p><h3>1960s - Mod Fashion</h3><p>Mini skirt, màu sắc rực rỡ, phá vỡ quy tắc cũ.</p><h3>1990s - Grunge</h3><p>Phong cách buông thả, áo flannel, quần rách.</p><h3>2020s - Diversity</h3><p>Đa dạng, bao trùm, không còn quy tắc cứng nhắc.</p>', 'Khám phá lịch sử phát triển của thời trang qua các thập kỷ', 'https://images.unsplash.com/photo-1509631179647-0177331693ae', 18, NULL, 'lịch sử,thời trang,thiết kế', 'published', 289, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 4),
(19, 'Làm Thế Nào Để Trông Cao Hơn Nhờ Trang Phục?', 'lam-the-nao-de-trong-cao-hon-nho-trang-phuc', '<h2>Trông Cao Hơn Với Trang Phục</h2><p>Không cần giày cao, bạn vẫn có thể hack chiều cao bằng cách chọn đồ thông minh.</p><h3>Quần ống đứng</h3><p>Tạo đường thẳng từ eo xuống chân, kéo dài tỷ lệ cơ thể.</p><h3>Monochrome outfit</h3><p>Mặc cùng tông màu từ trên xuống dưới tạo hiệu ứng thon cao.</p><h3>Áo cắt cao</h3><p>Crop top, áo tucked-in giúp chân trông dài hơn.</p><h3>Quần/váy lưng cao</h3><p>High-waist kéo dài chân hiệu quả nhất.</p><h3>Tránh horizontal stripes</h3><p>Sọc ngang làm bạn trông thấp hơn, chọn sọc dọc thay vào.</p>', 'Mẹo chọn trang phục giúp bạn trông cao ráo và thon gọn hơn', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c', 18, NULL, 'mẹo,chiều cao,hack dáng', 'published', 445, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 5),
(20, 'Tự Tin Với Cơ Thể Của Mình - Body Positivity', 'tu-tin-voi-co-the-cua-minh-body-positivity', '<h2>Body Positivity</h2><p>Yêu thương cơ thể mình là bước đầu tiên để tự tin và hạnh phúc.</p><h3>Mọi body đều đẹp</h3><p>Không có \"body chuẩn\". Mỗi cơ thể đều độc đáo và đáng được tôn trọng.</p><h3>Tìm style phù hợp</h3><p>Thay vì cố gắng mặc theo trend, hãy tìm style làm bạn cảm thấy thoải mái nhất.</p><h3>Tôn vinh ưu điểm</h3><p>Thay vì che giấu khuyết điểm, hãy làm nổi bật những gì bạn yêu thích ở mình.</p><h3>Fashion for all sizes</h3><p>Ngành thời trang đang ngày càng inclusive hơn với mọi kích cỡ.</p>', 'Tìm hiểu về body positivity và cách yêu thương cơ thể mình', 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675', 18, NULL, 'body positivity,tự tin,phong cách sống', 'published', 334, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 3),
(21, 'Typography Trong Thiết Kế Thương Hiệu Thời Trang', 'typography-trong-thiet-ke-thuong-hieu-thoi-trang', '<h2>Typography Trong Fashion Branding</h2><p>Font chữ đóng vai trò quan trọng trong việc xây dựng thương hiệu thời trang.</p><h3>Serif Fonts</h3><p>Cổ điển, sang trọng, thường dùng cho thương hiệu luxury (Vogue, Harper\'s Bazaar).</p><h3>Sans-serif</h3><p>Hiện đại, tối giản, dễ đọc (Calvin Klein, ZARA).</p><h3>Script Fonts</h3><p>Nữ tính, thanh lịch, thường dùng cho thương hiệu cao cấp nữ.</p><h3>Kết hợp fonts</h3><p>Không dùng quá 2-3 font, đảm bảo hierarchy rõ ràng.</p>', 'Tìm hiểu về vai trò của typography trong thiết kế thương hiệu thời trang', 'https://images.unsplash.com/photo-1493612276216-ee3925520721', 18, NULL, 'typography,thiết kế,branding', 'published', 198, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 4),
(22, 'So Sánh: Túi Xách Da Thật Vs Da Tổng Hợp', 'so-sanh-tui-xach-da-that-vs-da-tong-hop', '<h2>Da Thật vs Da Tổng Hợp</h2><p>Cả hai đều có ưu nhược điểm riêng. Hãy chọn phù hợp với budget và nhu cầu.</p><h3>Da thật</h3><p><strong>Ưu điểm:</strong> Bền, sang trọng, có patina đẹp theo thời gian. <strong>Nhược điểm:</strong> Đắt, cần bảo dưỡng cẩn thận.</p><h3>Da tổng hợp (PU/PVC)</h3><p><strong>Ưu điểm:</strong> Rẻ, đa dạng màu sắc, dễ chăm sóc, vegan-friendly. <strong>Nhược điểm:</strong> Không bền bằng da thật, có thể bong tróc.</p><h3>Khi nào chọn gì?</h3><p>Đầu tư: chọn da thật. Thời trang nhanh: da tổng hợp OK. Vegan: chắc chắn da tổng hợp.</p>', 'So sánh ưu nhược điểm giữa túi da thật và da tổng hợp', 'https://images.unsplash.com/photo-1591561954557-26941169b49e', 18, NULL, 'túi da,da thật,da tổng hợp', 'published', 267, '2025-11-26 15:12:44', '2025-11-26 15:12:44', '2025-11-26 15:12:44', 2);

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`, `image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Phụ kiện', 'phu-kien', 'Các bài viết về phụ kiện thời trang: túi xách, giày dép, trang sức, mắt kính...', 'https://1102style.vn/wp-content/uploads/2023/09/phu-kien-thoi-trang-nu-6.jpg', 1, 1, '2025-11-27 16:30:48', '2025-11-27 16:54:43'),
(2, 'Túi xách', 'tui-xach', 'Xu hướng túi xách, cách phối túi xách với trang phục', 'https://1102style.vn/wp-content/uploads/2025/09/tui-prada-deo-cheo-1.jpg', 2, 1, '2025-11-27 16:30:48', '2025-11-27 16:55:04'),
(3, 'Phong cách sống', 'phong-cach-song', 'Chia sẻ về cuộc sống, văn hóa, du lịch và thời trang', 'https://cl-wpml.careerlink.vn/cam-nang-viec-lam/wp-content/uploads/2025/06/05162539/nganh-van-hoa-du-lich-la-gi-9nnfd-1024x1024.jpg', 3, 1, '2025-11-27 16:30:48', '2025-11-27 16:55:14'),
(4, 'Thiết kế', 'thiet-ke', 'Nghệ thuật thiết kế thời trang, sáng tạo và cảm hứng', 'https://takepsd.com/wp-content/uploads/2020/08/01-26.jpg', 4, 1, '2025-11-27 16:30:48', '2025-11-27 16:55:24'),
(5, 'Mẹo & Thủ thuật', 'meo-thu-thuat', 'Các mẹo hay về thời trang, làm đẹp, mix đồ', 'https://lh3.googleusercontent.com/6vjpCn-6Pll-ukArrClzz4S1beg2QQTHQRB3uL8eJSxnihUuihkMNgvOc_6WPaB_Lrrd4py-58zosCfKqxC1owDDR1i0b_FrEWumRz5y2cQeGr7DNnpPMYsXe2gekL4AYcy5x-yKKiq53aDpMybGbT8', 5, 1, '2025-11-27 16:30:48', '2025-11-27 16:55:35');

-- --------------------------------------------------------

--
-- Table structure for table `blog_comments`
--

CREATE TABLE `blog_comments` (
  `id` bigint(20) NOT NULL,
  `blog_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_comments`
--

INSERT INTO `blog_comments` (`id`, `blog_id`, `user_id`, `content`, `created_at`) VALUES
(1, 1, 18, 'Bài viết rất hay và bổ ích!', '2025-11-02 10:30:00'),
(2, 1, 18, 'Cảm ơn bạn đã chia sẻ', '2025-11-03 15:20:00'),
(3, 2, 18, 'Mình đã thử và rất hài lòng', '2025-11-06 11:00:00'),
(4, 4, 18, 'Mình đã mua một số phụ kiện theo gợi ý và rất hài lòng!', '2025-11-26 16:00:00'),
(5, 4, 21, 'Bài viết rất hữu ích, đặc biệt là phần về mắt kính!', '2025-11-26 16:15:00'),
(6, 4, 22, 'Cảm ơn bạn đã chia sẻ, mình sẽ thử ngay!', '2025-11-26 16:30:00'),
(7, 5, 18, 'Mình có khuôn mặt tròn, sẽ thử gọng vuông như bạn gợi ý!', '2025-11-26 17:00:00'),
(8, 5, 21, 'Thông tin rất chi tiết, giúp mình chọn được kính phù hợp!', '2025-11-26 17:20:00'),
(9, 6, 18, 'Túi xách năm nay đúng là hot trend thật!', '2025-11-26 18:00:00'),
(10, 6, 22, 'Mình đang tìm túi mini bag, bài viết này rất hữu ích!', '2025-11-26 18:15:00'),
(11, 6, 21, 'Túi tote vẫn là lựa chọn yêu thích của mình!', '2025-11-26 18:30:00'),
(12, 7, 18, 'Bí quyết chọn túi công sở rất hay, mình sẽ áp dụng ngay!', '2025-11-26 19:00:00'),
(13, 7, 22, 'Màu sắc trung tính đúng là dễ phối đồ hơn!', '2025-11-26 19:20:00'),
(14, 8, 18, 'Minimalism là phong cách sống mình đang theo đuổi!', '2025-11-26 20:00:00'),
(15, 8, 21, 'Capsule wardrobe giúp mình tiết kiệm rất nhiều thời gian!', '2025-11-26 20:15:00'),
(16, 8, 22, 'Bài viết rất hay, mình sẽ thử áp dụng!', '2025-11-26 20:30:00'),
(17, 9, 18, 'Mẹo đóng gói hành lý rất hữu ích cho chuyến du lịch sắp tới!', '2025-11-26 21:00:00'),
(18, 9, 21, 'Nguyên tắc 5-4-3-2-1 rất hay, mình sẽ thử!', '2025-11-26 21:15:00'),
(19, 10, 18, 'Tâm lý học màu sắc rất thú vị!', '2025-11-27 08:00:00'),
(20, 10, 22, 'Mình thích màu đen vì nó vạn năng như bạn nói!', '2025-11-27 08:20:00'),
(21, 11, 18, 'Thời trang bền vững là xu hướng tương lai!', '2025-11-27 09:00:00'),
(22, 11, 21, 'Mình đang chuyển sang slow fashion, rất hài lòng!', '2025-11-27 09:15:00'),
(23, 11, 22, 'Upcycling là cách hay để tái chế quần áo cũ!', '2025-11-27 09:30:00'),
(24, 12, 18, '10 mẹo mix đồ rất hữu ích cho người mới như mình!', '2025-11-27 10:00:00'),
(25, 12, 21, 'Quy tắc 3 màu giúp mình phối đồ đẹp hơn nhiều!', '2025-11-27 10:20:00'),
(26, 12, 22, 'Cảm ơn bạn đã chia sẻ những mẹo hay!', '2025-11-27 10:40:00'),
(27, 13, 18, 'Bảo quản quần áo đúng cách giúp đồ bền hơn rất nhiều!', '2025-11-27 11:00:00'),
(28, 13, 21, 'Mình đã áp dụng và thấy hiệu quả rõ rệt!', '2025-11-27 11:15:00'),
(29, 13, 22, 'Túi hút ẩm là mẹo hay, mình sẽ thử!', '2025-11-27 11:30:00'),
(30, 4, 18, 'Mình đã mua thêm đồng hồ theo gợi ý, rất đẹp!', '2025-11-27 12:00:00'),
(31, 5, 22, 'Sau khi đọc bài này, mình đã chọn được kính phù hợp!', '2025-11-27 12:20:00'),
(32, 6, 18, 'Túi hobo đang là trend hot nhất năm nay!', '2025-11-27 13:00:00'),
(33, 8, 21, 'Minimalism giúp mình sống đơn giản và hạnh phúc hơn!', '2025-11-27 14:00:00'),
(34, 10, 18, 'Màu xanh dương đúng là tạo cảm giác tin cậy!', '2025-11-27 15:00:00'),
(35, 12, 21, 'Layer thông minh giúp outfit của mình đẹp hơn nhiều!', '2025-11-27 16:00:00'),
(36, 4, 25, 'haha', '2025-11-27 19:56:17');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image_url` varchar(1024) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `image_url`, `created_at`) VALUES
(4, 'Nike', 'nike', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXkAAACGCAMAAAAPbgp3AAAAhFBMVEX///8AAAD8/PzZ2dnq6ury8vL29va4uLjBwcHh4eHExMTz8/OUlJTT09Pd3d2enp5ISEjMzMyoqKhra2tOTk55eXlxcXGOjo4kJCQICAisrKw7OzuIiIizs7NWVlYvLy9jY2MWFhY5OTkYGBh/f38rKytUVFRdXV1nZ2cfHx9CQkKZmZm4FStmAAAHQUlEQVR4nO2d6XqyOhCATxBQKFbBrVKpS+1nq/d/f0eFVtQEskw24P1vMsyDk9ky/PcfD17A9bMOUV4WuiVoK0dXtwS2E4RcVmN6ghakVXiD/Sbj+uUMAYvSIpze6Ihmr3w/XqE+rDSt4TX9Rmib+pw/H6EjqDgtwc3m6Mwm5l4hQ4j/xy3FH8zWF7WjvYAzHiI0hhOpBTjxYnzVOlpzm5kLPdS98vQ4wegfKpgMhZZyz0u8A4nVdNxs8vardhQJBkAvl6VCGMEajduf3bSO1pkjuuDlmFhDSNZkvHBV0vrZzABY54/LQqn4Og1mGI3LWkdLUTNz5eqPLoX/OI0luMRJdxxhQs7FdbEuSYnlbNiXD2pHkx7M2mm+XJekfMIZ7N8ftS7uzfwR5usdgJZrDL1o+qx1NIXLbL0WS3Yu5Q0nSA4YrSM050xF4ngpjNi2O18LznHSF1btKPIg9zkWq64gF7UWL9y/4bWO3vkqHkQ2vwsDndYW48UR5jgtEMzNPBP9rvwFvLBtDLHH6S8ncL+v/7d2m535IK9skPgYwG/Zuy3fVmNzjpN+qtQuVPEg4m9vG0hY3nz+KhsktumLlI1L286kbGAyQbIhazznn6wQZ1/apF0tB242/6xTO5pJ63JMy9u0J2fjY1MxT2ZmJMfMXBiWN2pJTcQZRkeSru/MjARv5g/vLvM5l7iTIThBenjK9mKBzM1guI8bgANj4wiySbXveGMk2fCu7rdrsjd/9tgplY7QVKaZuR', '2025-11-29 10:15:35'),
(5, 'Adidas', 'adidas', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/250px-Adidas_Logo.svg.png', '2025-11-29 10:15:35'),
(6, 'Puma', 'puma', 'https://img.vuahanghieu.com/unsafe/0x700/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/2021/01/tim-hieu-lich-su-ra-doi-va-phat-trien-cua-thuong-hieu-puma-05012021111158.jpg', '2025-11-29 10:15:35'),
(7, 'Zara', 'zara', 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', '2025-11-29 10:15:35'),
(8, 'H&M', 'h-m', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png', '2025-11-29 10:15:35'),
(9, 'Uniqlo', 'uniqlo', 'https://play-lh.googleusercontent.com/8Z1ze4ruK38x5rRZaXGwuGi_wVaswyRDWZxJNTcw2t9QUZYlcQchzRxQL2DrH57nn2U', '2025-11-29 10:15:35'),
(10, 'Gucci', 'gucci', 'https://blankroom.co/cdn/shop/collections/gucci-authentic-blankroom-hanoi-vietnam_55333642-d8ff-4d6d-9338-79ae2b36af78.png?v=1752849840', '2025-11-29 10:15:35'),
(11, 'Louis Vuitton', 'louis-vuitton', 'https://upload.wikimedia.org/wikipedia/commons/7/76/Louis_Vuitton_logo_and_wordmark.svg', '2025-11-29 10:15:35'),
(12, 'Dior', 'dior', 'https://mia.vn/media/uploads/tin-tuc/thuong-hieu-dior-2-1690478102.jpg', '2025-11-29 10:15:35'),
(13, 'Chanel', 'chanel', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Chanel_logo_interlocking_cs.svg/1200px-Chanel_logo_interlocking_cs.svg.png', '2025-11-29 10:15:35'),
(14, 'Levi\'s', 'levis', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/1280px-Levi%27s_logo.svg.png', '2025-11-29 10:15:35'),
(15, 'Vans', 'vans', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFkG-wts1EP37H2OUCQMoP9zFq77wWSuHMEg&s', '2025-11-29 10:15:35'),
(16, 'Converse', 'converse', 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg', '2025-11-29 10:15:35'),
(17, 'New Balance', 'new-balance', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/1200px-New_Balance_logo.svg.png', '2025-11-29 10:15:35'),
(18, 'Calvin Klein', 'calvin-klein', 'https://bizweb.dktcdn.net/100/106/923/products/1-274182be-94be-4128-81fb-c9ab39698f1d.png?v=1619115493557', '2025-11-29 10:15:35'),
(19, 'Tommy Hilfiger', 'tommy-hilfiger', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDFtErhZaUe1vdaYoYu51_Coq6vQyQiCnHqA&s', '2025-11-29 10:15:35'),
(20, 'Hermes', 'hermes', 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Hermes_logo.svghttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiFJa8qbt3Km6jXskBLkLWt5_5aECgTiu2fQ&s', '2025-11-29 10:15:35'),
(21, 'Balenciaga', 'balenciaga', 'https://images.seeklogo.com/logo-png/36/1/balenciaga-logo-png_seeklogo-365962.png', '2025-11-29 10:15:35'),
(22, 'Off-White', 'off-white', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Off-White_logo.svghttps://cdn.sanity.io/images/599r6htc/regionalized/8d21d3f9525ac2c82934290913d496d0552fa75f-1440x810.jpg?w=1440&h=810&q=75&fit=max&auto=format', '2025-11-29 10:15:35'),
(23, 'Supreme', 'supreme', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Supreme_Logo.svghttps://upload.wikimedia.org/wikipedia/commons/2/28/Supreme_Logo.svg', '2025-11-29 10:15:35');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `status`, `updated_at`, `created_at`) VALUES
(1, 18, 'active', '2025-11-19 08:10:00', '2025-11-19 08:10:00'),
(2, 22, 'active', '2025-11-25 20:53:55', '2025-11-25 20:53:55'),
(4, 23, 'active', '2025-11-25 21:04:32', '2025-11-25 21:04:32'),
(7, 24, 'active', '2025-11-26 12:20:13', '2025-11-26 12:20:13'),
(8, 25, 'active', '2025-11-27 16:52:47', '2025-11-27 16:52:47');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price_snapshot` decimal(38,2) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `variant_id`, `qty`, `price_snapshot`, `created_at`) VALUES
(1, 1, 1, 2, 1, 199000.00, '2025-11-19 08:10:10'),
(21, 1, 2, 4, 1, 399000.00, '2025-11-25 23:27:08'),
(22, 1, 3, 6, 1, 599000.00, '2025-11-25 23:27:12'),
(24, 2, 2, 4, 1, 399000.00, '2025-11-26 12:17:00'),
(25, 2, 3, 6, 1, 599000.00, '2025-11-26 12:17:04'),
(26, 7, 3, 6, 1, 599000.00, '2025-11-26 12:20:15'),
(27, 7, 2, 4, 1, 399000.00, '2025-11-26 12:20:18'),
(31, 8, 1, 2, 1, 199000.00, '2025-11-27 21:06:53'),
(34, 4, 1, 2, 1, 199000.00, '2025-12-06 14:29:46'),
(35, 4, 3, 6, 1, 599000.00, '2025-12-06 14:55:56'),
(36, 4, 2, 4, 1, 399000.00, '2025-12-06 18:26:04');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `image_url`, `sort_order`, `created_at`, `description`) VALUES
(8, NULL, 'Nam', 'nam', NULL, 1, '2025-11-29 09:38:29', NULL),
(9, NULL, 'Nữ', 'nu', NULL, 2, '2025-11-29 09:38:42', NULL),
(10, NULL, 'Phụ kiện', 'phu-kien', NULL, 3, '2025-11-29 09:39:12', NULL),
(11, NULL, 'Giày', 'giay', NULL, 4, '2025-11-29 09:39:26', NULL),
(12, NULL, 'Trẻ em', 'tre-em', NULL, 5, '2025-11-29 09:39:53', NULL),
(13, NULL, 'Thể thao', 'the-thao', NULL, 6, '2025-11-29 09:40:22', NULL),
(100, 8, 'Áo thun nam', NULL, 'https://product.hstatic.net/200000404243/product/a2mn438r2-cnma159-2410-n__1__e07e89fa83224938a77506f0816374e5.jpg', 1, '2025-11-29 09:53:04', NULL),
(101, 8, 'Áo polo nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Zya_bOXSGSGf2dKLXcHkOAJ6KdR-Ro6h-A&s', 2, '2025-11-29 09:53:04', NULL),
(102, 8, 'Áo sơ mi nam', NULL, 'https://product.hstatic.net/200000588671/product/ao-so-mi-nam-bycotton-trang-art-nhan_8ec622a241ea4deb93a02bdbdcb87954.jpg', 3, '2025-11-29 09:53:04', NULL),
(103, 8, 'Áo khoác & Hoodie nam', NULL, 'https://product.hstatic.net/1000184601/product/men_xam-dom-melange__1__1727e769a60b4217a3708e99e65d218e_master.jpg', 4, '2025-11-29 09:53:04', NULL),
(110, 8, 'Quần jean nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5w4J1zxKszUnN7oMgh5fbh4jU4r7nxBpCg&s', 5, '2025-11-29 09:53:04', NULL),
(111, 8, 'Quần tây nam', NULL, 'https://product.hstatic.net/200000404243/product/q1m428r0-inma037-2412-0__1__5051c74154c846308094c8fda081a8cf.jpg', 6, '2025-11-29 09:53:04', NULL),
(112, 8, 'Quần kaki nam', NULL, 'https://pos.nvncdn.com/492284-9176/ps/20210205_dM2kDwvTM2P9PdalJCUZCV9F.jpg?v=1674788166', 7, '2025-11-29 09:53:04', NULL),
(113, 8, 'Quần short nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQavp6uGQ6RSbqyBbp1Fe_uN6IRWA8DICP8JQ&s', 8, '2025-11-29 09:53:04', NULL),
(114, 8, 'Quần jogger nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaXyS-a8P5XUxAa0_E23FyOvBy0-0CXgkFeA&s', 9, '2025-11-29 09:53:04', NULL),
(120, 8, 'Bộ thể thao nam', NULL, 'https://product.hstatic.net/1000312752/product/2_176f7e88ce58462fb361bd9ef72c1958.png', 10, '2025-11-29 09:53:04', NULL),
(121, 8, 'Đồ mặc nhà nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe7PcyOlYpVqMyzsgyJm9rmFcOapIz3bRmVw&s', 11, '2025-11-29 09:53:04', NULL),
(122, 8, 'Bộ đồ ngủ nam', NULL, 'https://pos.nvncdn.com/4866c4-103846/ps/20250922_Y2UShyA9tV.jpeg?v=1758506925', 12, '2025-11-29 09:53:04', NULL),
(200, 9, 'Áo thun nữ', NULL, 'https://cdn.kkfashion.vn/25449-large_default/ao-thun-nu-phom-rong-mau-kem-asm15-20.jpg', 1, '2025-11-29 09:53:04', NULL),
(201, 9, 'Áo polo nữ', NULL, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/04/ao-polo-nu-lacoste-women-s-slim-fit-stretch-cotton-pique-polo-pf5462-2r3-mau-hong-size-36-6614fb17856b6-09042024152351.jpg', 2, '2025-11-29 09:53:04', NULL),
(202, 9, 'Áo sơ mi nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqaS4NXGa7G5lNWmS6z54KnXEdQLp5hR7xvQ&s', 3, '2025-11-29 09:53:04', NULL),
(203, 9, 'Áo khoác & Cardigan nữ', NULL, 'https://bizweb.dktcdn.net/100/287/440/products/ao-khoac-local-brand-dep-co-non-mau-den-16.jpg?v=1662561434127', 4, '2025-11-29 09:53:04', NULL),
(204, 9, 'Áo kiểu / blouse nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHAYPtoWeGrZnvuA_sDln-PFEmpeH2P3HkRA&s', 5, '2025-11-29 09:53:04', NULL),
(205, 9, 'Áo croptop nữ', NULL, 'https://product.hstatic.net/200000774833/product/ao-croptop-ngan-tay-om-body-du-mau-new-hong-9ff35_3b4ae51eab1e4c2a8be97781e01bdeef_master.jpg', 6, '2025-11-29 09:53:04', NULL),
(210, 9, 'Quần jean nữ', NULL, 'https://media.routine.vn/1200x1500/prod/media/10f24dpaw048-mindigo-1-quan-jean-nu-jpg-oe37.webp', 7, '2025-11-29 09:53:04', NULL),
(211, 9, 'Quần short nữ', NULL, 'https://dytbw3ui6vsu6.cloudfront.net/media/catalog/product/resize/750x750/ADLV/000-ADLV-24SS-SPWSBX-BEG/000-ADLV-24SS-SPWSBX-BEG-002.webp', 8, '2025-11-29 09:53:04', NULL),
(212, 9, 'Quần culottes nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwCh2WnddiW8b3tc146vmM-WfARWAi_f-BwQ&s', 9, '2025-11-29 09:53:04', NULL),
(213, 9, 'Quần tây nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8XqMHqJ6zZs3Lgn1vlNfMte28oFIUEdoUA&s', 10, '2025-11-29 09:53:04', NULL),
(214, 9, 'Quần ống rộng nữ', NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ3zmPrk1l-RQz21bVCMkhkbk5UUNY0ffXTrWKIAULIYE-c55iatL-lNi18DLPBb1nOWF0h32-EGUQdO9ykxadl0lqzc9GHwoSkDN1B8dtp7hUNmJRWBRjgfUMrCrgsj7Ls2VooWwZ2&usqp=CAc', 11, '2025-11-29 09:53:04', NULL),
(220, 9, 'Váy ngắn nữ', NULL, 'https://pos.nvncdn.com/4bdb38-109797/ps/20230706_GdbGceITST.jpeg?v=1688644175', 12, '2025-11-29 09:53:04', NULL),
(221, 9, 'Váy midi nữ', NULL, 'https://bizweb.dktcdn.net/100/326/676/products/chan-vay-nu-4-c9dce3ef-2b59-43e3-8564-2c89303da812.jpg?v=1694139283050', 13, '2025-11-29 09:53:04', NULL),
(222, 9, 'Váy dài nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT087J9_vDrmnHjm-z54cWdwouG3J855TzdA&s', 14, '2025-11-29 09:53:04', NULL),
(223, 9, 'Đầm công sở nữ', NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRrFwT7X5hHaTCRfBE4-ShCHMW5iV1AJasULbtDfDNk2svjKq-OwsAn-hE6FelyhoF5Not-rNOV6wtmrTcy43td2gvBn9TZJjlBH9gvKHgoPo46ygTS1nPpXUjREAc2FkQUogrQld4T&usqp=CAc', 15, '2025-11-29 09:53:04', NULL),
(224, 9, 'Đầm dự tiệc nữ', NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTSySinFa_iPe12Eec4MAiZ46I42i5SKZNaALSdNM0l1jytAieA6_iiYmAii88zaUezG3gF5LIROjev3e4rxZ_l7y3PToP0foTQL97r_10YI2TDxOftl2q9PPOMue2_jBIdk9qVkiA&usqp=CAc', 16, '2025-11-29 09:53:04', NULL),
(225, 9, 'Đầm suông / basic nữ', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTVaP29uL9n2Vm0AIVP6koRzAQsJV0EPlbuZmeFBndaiim_EkCvhSy7obBsmx4GE1z3J0Qf0gN82hZW7g2AO0eIt5tlGhsGrL0hHG2H88_Ne53n2sEl4_77Roz3RMuyjO52bvrnzdE&usqp=CAc', 17, '2025-11-29 09:53:04', NULL),
(230, 9, 'Đồ mặc nhà nữ', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRhRTyRaGSmsXe1IWdwZf49Q-MGmh27eYzwgY85SqusH7zcqjyDw9XBWKZzPVEuZ6lJpjWkUqmCVQXq1o61PDUwsqliH7GUcnLm_seiiYx3BiCDaNkuZKMLD450F8GF6v5T5gEmdck&usqp=CAc', 18, '2025-11-29 09:53:04', NULL),
(231, 9, 'Bộ pijama nữ', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSEhC2WbWSJUs11bspxL6Pz-LaIhhkri728qMQPdtq_oudMrrlolziahM3qqWmfdavvag9sy1Mx279r83M1zaaUReqLJFcgSDmMseYs4Sj2NTkTd-leVcPJpVdTjwWajGVmBiPxZw&usqp=CAc', 19, '2025-11-29 09:53:04', NULL),
(232, 9, 'Bộ thể thao nữ', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT7tN2KyNs1Z47LpG6k2brJzA-4uC4vOmEP1siUPh_o-NwHzkgrVyDNNoiiVgt1WEyBAeTewWrYFGRBt30P19aBvkA8E0bV4S78UVVDnYbnPcWjabA82k9chFBu9NhJDK55avkloqx3Nw&usqp=CAc', 20, '2025-11-29 09:53:04', NULL),
(233, 9, 'Bộ đồ bộ nữ', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSXPEL3_x8cjuEukPZvXyUmzMpwRqvHsKyTmFhpai5LWo5dHJ8gLqmL9nY-1aAW8d4-M5isXkywMBGepoAygVKNvzAnf8WNmvMk3BpmWaFg04dtvlnwPgzqJQ&usqp=CAc', 21, '2025-11-29 09:53:04', NULL),
(300, 10, 'Dép lê', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQm3vh8PcwReFpOmeOCYDzQqv1xVpRxFhcGozgxJZnroM2Z-rYQFqfwaRckfTP7ZBw-_JD6kq_6pDsv_sSm4cbfd-8HXjYGP9H2bTtNMwsym6Fw4IPy4AIP1y_VrzozTWNqJDTnyA&usqp=CAc', 1, '2025-11-29 09:53:04', NULL),
(301, 10, 'Dép kẹp', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRaqL460hPcZc7R7mXaHPHMrf7ZYWdkclUtnNoRuzbvfXwZ1BkEKcbwJz0v73n2NqgKqGi5EkBu69zeG61RdnqRYOY3mV-K5h3UC2CeWYRubrGZ_teIhVTberSxzoep3Boh2qJ5CA&usqp=CAc', 2, '2025-11-29 09:53:04', NULL),
(302, 10, 'Sandal thời trang', NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQi8qhKDpAWdD2wa95M3ZT-RO3NrACqTyyKyqS7cFGspzOKKN5FrJLWGZN_qI5GUzV_mswMi0sEecoWR3YAsI8bmJ06xJ7fqhEqllPYV-l69kwpbdKbOPmQ85AbmDr6qRa-8AbH2g&usqp=CAc', 3, '2025-11-29 09:53:04', NULL),
(303, 10, 'Dép trong nhà', NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQnL-eqgdutYxgNgvycgwDxMNIDT7Ge_7mwVrA6vpPgwio-_ruC1FalDR67907DI-nK1BT1GJirqGiUaV4tTpO1HoIk6gC7hVLsh3HjEp9WjvnKgOCCx42jUJRj6hOt2oexM2KLtQ&usqp=CAc', 4, '2025-11-29 09:53:04', NULL),
(304, 10, 'Túi xách tay', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSmnh9VbaugRjEc5-ThEsD-0YYw8boQYs4lbGmwZgcyBim3ZVKCs90VCslNgckBWTb3xgs-F-pj44fOvUS-9LPBKNPvh90QU9HkgiUDwUUhFQGmVx43ye2d2RCW_7ifvtH6gsUqAA&usqp=CAc', 5, '2025-11-29 09:53:04', NULL),
(305, 10, 'Túi đeo chéo', NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTy7ekaBnCU0UF805lITatdN-JRgcLxvWt6OCCBJbEa0XGRD3foB3gJOZccks0XFEptUvEOswz98haTlxqBXxuFf4aMDVCaIV4_J6utx7LSYtCSRImHvwpLjywI7PA226UXOlVKcu8&usqp=CAc', 6, '2025-11-29 09:53:04', NULL),
(306, 10, 'Túi đeo vai', NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTl_sh73f_hhEb73Ls0oBF1K1H1Xw0o0TUSXBQ2mTS30Cf1zlivqHhK4AZ2q6aPRDodHNTvtoqhv6lTsNiDbToMDg1caQiB7OsnrhoHb-4CKM5xju9Ta-f0zSfUfyY6lcR-XUvdJ_c&usqp=CAc', 7, '2025-11-29 09:53:04', NULL),
(307, 10, 'Ba lô mini', NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQvgzjpZG6-MUjryOrlr9NUwzARl_0yfzOAe-WGv9khMpugt6M3mw1zKbfb7CaKesTssK61oU0tneG7X4OSOfEmbNNlzTp_gB81SCA6bG9q3kmSIBxJUq77Z5cKT_HZCRRhgQnYUg&usqp=CAc', 8, '2025-11-29 09:53:04', NULL),
(308, 10, 'Ví / bóp', NULL, 'https://cdn.kosshop.vn/upload/images/product/V1FZJO-S00-11A/full/1.jpg', 9, '2025-11-29 09:53:04', NULL),
(309, 10, 'Mũ / nón', NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRd8_ESe5ezcEIR6nbIgeRYjZdCDLnt3Kqs-gG_ee7As2ST3RCRrEmTCiaPaojRTGVvgiEimtbvRZPhvn6k4uuIWD2vttBbM2TAO82Im5kS8HxRUpHa2pqY1G7IOT8mCmSXnzwrspY&usqp=CAc', 10, '2025-11-29 09:53:04', NULL),
(310, 10, 'Kính mát', NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS_HAxRJopeRcccQM01u_Swb32LUUudsltWP_jDlZ3djjWXobbKomZwdxXVFW72KH6ObZ2UmN9eot-yTXTBe7ITA2bfY-bUMS7bP_u0B2C01CULoVorEG_-XSyX9RI78RtJYJCTUuX2&usqp=CAc', 11, '2025-11-29 09:53:04', NULL),
(311, 10, 'Thắt lưng', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQw7kpyBRYphtHOWA2j3WH0QVWcZLyHaEhPQ&s', 12, '2025-11-29 09:53:04', NULL),
(312, 10, 'Khăn choàng / khăn quàng', NULL, 'https://sakurafashion.vn/upload/sanpham/large/543802-khan-choang-hai-mat-tua-rua-phien-ban-han-quoc-1.jpg', 13, '2025-11-29 09:53:04', NULL),
(313, 10, 'Vớ / tất', NULL, 'https://pos.nvncdn.com/cba2a3-7534/ps/content/20230314_ti2t7xp1rHb0.jpg', 14, '2025-11-29 09:53:04', NULL),
(314, 10, 'Găng tay', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMYz7GR-PEIdOnIJtELYIT2K3kbbJCdvYEiQ&s', 15, '2025-11-29 09:53:04', NULL),
(315, 10, 'Trang sức thời trang', NULL, 'https://cdn.tgdd.vn/Files/2022/01/18/1411461/tuoi-1_1280x720-800-resize.jpg', 16, '2025-11-29 09:53:04', NULL),
(400, 11, 'Sneaker nam', NULL, 'https://product.hstatic.net/200000410665/product/giay-the-thao-nam-xb20649fk-2_a2f0e9136e6849da95f6c6476d9dbdec.jpg', 1, '2025-11-29 09:53:04', NULL),
(401, 11, 'Giày thể thao nam', NULL, 'https://product.hstatic.net/200000940675/product/1_d02e2cd89fcb4dd1abe6b23237cc3d69.jpg', 2, '2025-11-29 09:53:04', NULL),
(402, 11, 'Giày da nam', NULL, 'https://wtco.com.vn/wp-content/uploads/2022/11/giay-da-nam-louis.jpg', 3, '2025-11-29 09:53:04', NULL),
(403, 11, 'Giày boot nam', NULL, 'https://product.hstatic.net/200000410665/product/giay-chelsea-boot-nam-mulgati-j8030x-7_01a8a7b6abf8446dbba143b4aeca849b.jpg', 4, '2025-11-29 09:53:04', NULL),
(404, 11, 'Dép / sandal nam', NULL, 'https://timan.vn/upload/products/122024/dep-sandal-nam-tmdl123-sang-trong.jpg', 5, '2025-11-29 09:53:04', NULL),
(410, 11, 'Sneaker nữ', NULL, 'https://product.hstatic.net/200000410665/product/giay-the-thao-nam-xb20649fk-2_a2f0e9136e6849da95f6c6476d9dbdec.jpg', 6, '2025-11-29 09:53:04', NULL),
(411, 11, 'Giày thể thao nữ', NULL, 'https://timan.vn/upload/products/082024/giay-the-thao-nu-tmsz124-cao-cap.jpg', 7, '2025-11-29 09:53:04', NULL),
(412, 11, 'Giày cao gót nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT16e72cKVy7RVa8WkD4YF0qG5ZbAHh-Z0pMg&s', 8, '2025-11-29 09:53:04', NULL),
(413, 11, 'Giày búp bê nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCccztDyCvodW_5-_0J844rp-ezMJnzOIgdA&s', 9, '2025-11-29 09:53:04', NULL),
(414, 11, 'Dép / sandal nữ', NULL, 'https://timan.vn/upload/products/072024/dep-sandal-nu-tmxn242-tre-trung.jpg', 10, '2025-11-29 09:53:04', NULL),
(500, 12, 'Áo bé trai', NULL, 'https://product.hstatic.net/1000290074/product/57740000-5_50cf2b5e926247fface69fc4708d61d4.jpg', 1, '2025-11-29 09:53:04', NULL),
(501, 12, 'Quần bé trai', NULL, 'https://cdn1.concung.com/storage/2024/10/1728468548-hn0724015-2-1.webp', 2, '2025-11-29 09:53:04', NULL),
(502, 12, 'Bộ đồ bé trai', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShHjhrsXY2IVcIsmyeGo4EbB8O20lRx7eREA&s', 3, '2025-11-29 09:53:04', NULL),
(503, 12, 'Đồ ngủ bé trai', NULL, 'https://product.hstatic.net/1000290074/product/96300125_c08381dad61340e1b627dc0ef426147a_grande.jpg', 4, '2025-11-29 09:53:04', NULL),
(504, 12, 'Đồ thể thao bé trai', NULL, NULL, 5, '2025-11-29 09:53:04', NULL),
(510, 12, 'Áo bé gái', NULL, NULL, 6, '2025-11-29 09:53:04', NULL),
(511, 12, 'Váy bé gái', NULL, NULL, 7, '2025-11-29 09:53:04', NULL),
(512, 12, 'Quần / legging bé gái', NULL, 'https://bizweb.dktcdn.net/100/396/689/products/th095-quan-legging-be-gai-resize-anh-2.jpg?v=1598325269497', 8, '2025-11-29 09:53:04', NULL),
(513, 12, 'Đầm liền bé gái', NULL, 'https://product.hstatic.net/200000492283/product/gds410r-sm074-1__4__cd6c23d2a6eb48daa10be73048b1b6a3_master.jpg', 9, '2025-11-29 09:53:04', NULL),
(514, 12, 'Đồ ngủ bé gái', NULL, 'https://phucankids.com/wp-content/uploads/2020/11/%C4%91%E1%BB%93-b%E1%BB%99-ng%E1%BB%A7-b%C3%A9-g%C3%A1i.jpg', 10, '2025-11-29 09:53:04', NULL),
(515, 12, 'Đồ thể thao bé gái', NULL, 'https://cdn.becungshop.vn/images/300x300/set-ao-thun-croptop-banynis-phoi-quan-dui-day-rut-danh-cho-be-gai-p27513fffb214f-300x300.jpg', 11, '2025-11-29 09:53:04', NULL),
(600, 13, 'Áo thể thao nam', NULL, 'https://cdn.yousport.vn/Media/Products/090425015620808/ao-t-shirt-kamito-galaxy-3-xanh-den_large.jpg', 1, '2025-11-29 09:53:04', NULL),
(601, 13, 'Quần thể thao nam', NULL, 'https://product.hstatic.net/1000369857/product/fp02_xam_3_3c3f9c059763477c87b1a1c54b4eb0a1.jpg', 2, '2025-11-29 09:53:04', NULL),
(602, 13, 'Quần short thể thao', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6ydR0bC79gIxJYvf8IRNcHFfMDiJEqaTT2g&s', 3, '2025-11-29 09:53:04', NULL),
(603, 13, 'Bộ gym / training nam', NULL, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2025/03/bo-quan-ao-nam-adidas-gym-brandlove-workout-in5576-ic6976-mau-den-size-s-67ea62c7e038d-31032025163919.jpg', 4, '2025-11-29 09:53:04', NULL),
(604, 13, 'Đồ chạy bộ nam', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrZHFVPTTvPjEEVbnyChO1rj3gRTIP7Ak6QQ&s', 5, '2025-11-29 09:53:04', NULL),
(610, 13, 'Áo thể thao nữ', NULL, 'https://bizweb.dktcdn.net/100/522/096/products/z6065786835746-1c4a44bc15e13d1df0f6cc081c8fa619.jpg?v=1732652124870', 6, '2025-11-29 09:53:04', NULL),
(611, 13, 'Bra thể thao nữ', NULL, 'https://pos.nvncdn.com/822bfa-13829/ps/content/20230316_sXtxR5wx32vp.jpg', 7, '2025-11-29 09:53:04', NULL),
(612, 13, 'Legging thể thao nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNtgy9KdYeEEh-1o86JDno22OVt6-PKhM_PA&s', 8, '2025-11-29 09:53:04', NULL),
(613, 13, 'Jogger thể thao nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5FwdEInCZQKyPxLA1aHfnxvVgBgD0fQtXsA&s', 9, '2025-11-29 09:53:04', NULL),
(614, 13, 'Bộ gym / yoga nữ', NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTVkms3_rLFETZED3-NpyDXDmBRLcbo5fqpw&s', 10, '2025-11-29 09:53:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `comparison_items`
--

CREATE TABLE `comparison_items` (
  `id` bigint(20) NOT NULL,
  `added_at` datetime(6) NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `comparison_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comparison_items`
--

INSERT INTO `comparison_items` (`id`, `added_at`, `sort_order`, `comparison_id`, `product_id`) VALUES
(1, '2025-11-27 21:17:29.000000', 1, 1, 2),
(2, '2025-11-27 21:17:35.000000', 2, 1, 3),
(3, '2025-11-27 21:18:16.000000', 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message_body` varchar(2000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `handled_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `value` decimal(38,2) DEFAULT NULL,
  `min_order` decimal(38,2) DEFAULT NULL,
  `max_discount` decimal(38,2) DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `per_user_limit` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `used_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `min_order`, `max_discount`, `start_at`, `end_at`, `usage_limit`, `per_user_limit`, `status`, `created_at`, `used_count`) VALUES
(1, 'WELCOME1', 'PERCENT', 100.00, 200000.00, 1000000.00, '2025-11-01 00:00:00', '2025-12-31 23:59:59', 1000, 1, 'active', '2025-11-21 18:13:53', NULL),
(2, 'FREESHIP30', 'FIXED', 30000.00, 300000.00, 100000.00, '2025-11-01 00:00:00', '2025-12-31 23:59:59', 500, NULL, 'active', '2025-11-21 18:13:53', NULL),
(3, 'BLACKFRIDAY20', 'PERCENT', 20.00, 500000.00, 150000.00, '2025-11-25 00:00:00', '2025-12-02 23:59:59', 200, 2, 'active', '2025-11-21 18:13:53', NULL),
(4, 'OLD2024', 'PERCENT', 15.00, 300000.00, 80000.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 100, 1, 'expired', '2025-11-21 18:13:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupon_usages`
--

CREATE TABLE `coupon_usages` (
  `id` bigint(20) NOT NULL,
  `coupon_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `discount_amount` decimal(38,2) DEFAULT NULL,
  `used_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_usages`
--

INSERT INTO `coupon_usages` (`id`, `coupon_id`, `order_id`, `user_id`, `discount_amount`, `used_at`) VALUES
(1, 1, 63, 23, 798000.00, '2025-12-06 14:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_reservations`
--

CREATE TABLE `inventory_reservations` (
  `id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `consumed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_reservations`
--

INSERT INTO `inventory_reservations` (`id`, `variant_id`, `order_id`, `qty`, `status`, `expires_at`, `created_at`, `consumed_at`) VALUES
(1, 2, 1, 2, 'consumed', '2025-11-19 09:00:00', '2025-11-19 08:20:10', '2025-11-19 08:21:00'),
(2, 4, 1, 1, 'consumed', '2025-11-19 09:00:00', '2025-11-19 08:20:12', '2025-11-19 08:21:00'),
(3, 7, 1, 1, 'consumed', '2025-11-19 09:00:00', '2025-11-19 08:20:14', '2025-11-19 08:21:00'),
(4, 2, 19, 1, 'consumed', '2025-11-22 15:10:55', '2025-11-22 15:00:55', '2025-11-22 15:01:26'),
(5, 2, 20, 1, 'consumed', '2025-11-23 00:57:10', '2025-11-23 00:47:10', '2025-11-23 00:48:01'),
(6, 2, 21, 1, 'consumed', '2025-11-23 01:12:18', '2025-11-23 01:02:18', '2025-11-23 01:03:19'),
(7, 2, 22, 1, 'consumed', '2025-11-23 01:20:54', '2025-11-23 01:10:54', '2025-11-23 01:11:14'),
(8, 2, 23, 1, 'consumed', '2025-11-23 01:48:51', '2025-11-23 01:38:51', '2025-11-23 01:39:52'),
(9, 2, 24, 1, 'consumed', '2025-11-23 01:58:50', '2025-11-23 01:48:50', '2025-11-23 01:49:11'),
(10, 2, 25, 1, 'consumed', '2025-11-23 02:11:03', '2025-11-23 02:01:03', '2025-11-23 02:01:34'),
(11, 2, 26, 1, 'consumed', '2025-11-23 02:39:26', '2025-11-23 02:29:26', '2025-11-23 02:30:17'),
(12, 2, 27, 1, 'expired', '2025-11-23 03:19:27', '2025-11-23 03:09:27', NULL),
(13, 2, 28, 1, 'consumed', '2025-11-23 15:42:30', '2025-11-23 15:32:30', '2025-11-23 15:33:01'),
(14, 2, 29, 1, 'expired', '2025-11-23 15:48:28', '2025-11-23 15:38:28', NULL),
(15, 2, 30, 1, 'expired', '2025-11-23 16:05:10', '2025-11-23 15:55:10', NULL),
(16, 2, 31, 1, 'released', '2025-11-23 16:20:49', '2025-11-23 16:10:49', NULL),
(17, 2, 32, 1, 'expired', '2025-11-23 16:22:33', '2025-11-23 16:12:33', NULL),
(18, 2, 33, 1, 'released', '2025-11-23 16:32:40', '2025-11-23 16:22:40', NULL),
(19, 2, 34, 1, 'released', '2025-11-23 16:38:57', '2025-11-23 16:28:57', NULL),
(20, 2, 35, 1, 'released', '2025-11-23 16:41:14', '2025-11-23 16:31:14', NULL),
(22, 2, 37, 1, 'released', '2025-11-23 16:45:47', '2025-11-23 16:35:47', NULL),
(23, 2, 38, 1, 'released', '2025-11-23 16:51:42', '2025-11-23 16:41:42', NULL),
(24, 2, 39, 1, 'released', '2025-11-23 16:58:20', '2025-11-23 16:48:20', NULL),
(25, 2, 40, 1, 'released', '2025-11-23 17:07:13', '2025-11-23 16:57:13', NULL),
(26, 2, 41, 1, 'released', '2025-11-23 17:17:32', '2025-11-23 17:07:32', NULL),
(27, 2, 42, 1, 'expired', '2025-11-23 17:20:49', '2025-11-23 17:10:49', NULL),
(28, 2, 43, 1, 'consumed', '2025-11-23 17:31:58', '2025-11-23 17:21:58', '2025-11-23 17:24:13'),
(29, 2, NULL, 1, 'held', '2025-11-23 18:12:56', '2025-11-23 17:42:56', NULL),
(30, 2, 45, 1, 'expired', '2025-11-23 17:53:05', '2025-11-23 17:43:05', NULL),
(31, 4, 46, 1, 'consumed', '2025-11-26 23:36:45', '2025-11-26 23:26:45', '2025-11-26 23:28:35'),
(32, 4, 47, 1, 'released', '2025-11-26 23:49:51', '2025-11-26 23:39:51', NULL),
(40, 4, 55, 1, 'consumed', '2025-11-26 23:56:35', '2025-11-26 23:46:35', '2025-11-26 23:48:16'),
(41, 4, 56, 1, 'held', '2025-11-27 00:06:06', '2025-11-26 23:56:06', NULL),
(42, 4, 57, 1, 'released', '2025-11-27 00:12:04', '2025-11-27 00:02:04', NULL),
(43, 4, 58, 1, 'held', '2025-11-27 14:19:17', '2025-11-27 13:49:17', NULL),
(44, 2, 59, 1, 'consumed', '2025-11-27 21:54:00', '2025-11-27 21:44:00', '2025-11-27 21:45:31'),
(45, 4, 60, 5, 'held', '2025-12-06 14:58:45', '2025-12-06 14:28:45', NULL),
(46, 6, 60, 4, 'held', '2025-12-06 14:58:45', '2025-12-06 14:28:45', NULL),
(47, 27, 60, 1, 'held', '2025-12-06 14:58:45', '2025-12-06 14:28:45', NULL),
(48, 2, 61, 1, 'held', '2025-12-06 14:59:50', '2025-12-06 14:29:50', NULL),
(49, 2, 62, 1, 'released', '2025-12-06 15:00:43', '2025-12-06 14:30:43', NULL),
(50, 2, 63, 1, 'held', '2025-12-06 15:26:02', '2025-12-06 14:56:02', NULL),
(51, 6, 63, 1, 'held', '2025-12-06 15:26:02', '2025-12-06 14:56:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invitations`
--

CREATE TABLE `invitations` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(191) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `preset_role_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`preset_role_ids`)),
  `status` varchar(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `invited_by` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `login_method` varchar(30) NOT NULL COMMENT 'email, google, facebook, phone',
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL COMMENT 'City, Country',
  `status` varchar(20) NOT NULL COMMENT 'success, failed',
  `failure_reason` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`id`, `user_id`, `login_method`, `ip_address`, `user_agent`, `location`, `status`, `failure_reason`, `created_at`) VALUES
(1, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:12:14'),
(2, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:12:25'),
(3, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:12:43'),
(4, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:14:03'),
(5, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:14:54'),
(6, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:14:55'),
(7, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:15:03'),
(8, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:15:46'),
(9, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:16:52'),
(10, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:16:58'),
(11, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:18:14'),
(12, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:18:21'),
(13, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:18:25'),
(14, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:18:26'),
(15, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:19:04'),
(16, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:21:01'),
(17, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:36'),
(18, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:38'),
(19, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:39'),
(20, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:47'),
(21, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:48'),
(22, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:50'),
(23, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:51'),
(24, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:53'),
(25, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:55'),
(26, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:22:56'),
(27, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:23:30'),
(28, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:23:36'),
(29, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:23:38'),
(30, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:23:39'),
(31, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:23:40'),
(32, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:24:07'),
(33, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:24:42'),
(34, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:26:32'),
(35, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:26:58'),
(36, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:27:22'),
(37, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:27:28'),
(38, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:28:00'),
(39, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:28:18'),
(40, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:29:28'),
(41, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:29:49'),
(42, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-14 14:29:52'),
(43, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 17:48:07'),
(44, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 17:49:18'),
(45, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 20:57:00'),
(46, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 20:57:03'),
(47, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:00:05'),
(49, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:01:40'),
(50, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:01:42'),
(53, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:02:42'),
(60, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:03:28'),
(61, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:03:50'),
(62, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:04:32'),
(63, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:07:48'),
(64, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:11:26'),
(65, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:12:28'),
(66, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:15:30'),
(67, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:17:42'),
(68, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:18:56'),
(69, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:24:05'),
(70, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:29:13'),
(71, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 21:54:47'),
(72, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 22:07:21'),
(76, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 23:10:31'),
(78, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-20 23:22:20'),
(80, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 00:31:40'),
(81, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 00:31:42'),
(83, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 09:09:08'),
(85, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 10:52:08'),
(87, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 11:10:56'),
(88, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 11:30:33'),
(89, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 12:43:27'),
(90, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 12:43:29'),
(92, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 13:44:40'),
(93, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 14:58:37'),
(94, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 15:00:39'),
(95, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 15:39:51'),
(96, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 17:35:07'),
(97, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 18:38:43'),
(99, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 20:17:08'),
(100, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 21:21:05'),
(101, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 21:21:08'),
(102, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 22:33:44'),
(103, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-21 22:59:32'),
(104, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-22 14:04:32'),
(106, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 00:46:54'),
(107, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 01:48:40'),
(108, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 02:58:23'),
(109, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 15:21:45'),
(110, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 16:22:29'),
(111, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 17:22:53'),
(113, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 18:37:50'),
(114, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-23 19:12:28'),
(115, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 12:02:16'),
(116, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 13:04:06'),
(117, 21, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 13:07:23'),
(118, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:23:14'),
(120, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:44:49'),
(125, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:52:53'),
(126, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:54:02'),
(127, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:58:04'),
(128, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:58:54'),
(129, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 14:59:18'),
(130, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 15:07:33'),
(131, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 15:12:04'),
(132, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 15:12:52'),
(133, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 15:18:58'),
(134, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 15:19:17'),
(135, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 18:46:59'),
(137, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:17:24'),
(139, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:18:07'),
(140, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:20:56'),
(141, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:24:48'),
(142, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:31:20'),
(143, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:42:19'),
(144, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-24 21:53:24'),
(145, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 13:48:18'),
(146, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 13:49:10'),
(147, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 13:51:38'),
(148, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 13:58:12'),
(150, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 14:00:11'),
(151, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 14:02:21'),
(153, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 14:05:11'),
(154, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:11:05'),
(155, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:12:00'),
(156, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:17:45'),
(157, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:19:14'),
(158, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:21:14'),
(159, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:21:30'),
(160, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:30:42'),
(161, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:35:14'),
(162, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 16:41:56'),
(163, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 17:49:58'),
(164, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 17:51:07'),
(166, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 17:59:34'),
(167, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:18:38'),
(168, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:24:38'),
(169, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:26:04'),
(170, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:33:06'),
(171, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:38:15'),
(173, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 18:50:19'),
(174, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 20:23:45'),
(175, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 20:42:22'),
(176, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 20:53:37'),
(177, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 21:00:46'),
(179, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 23:23:26'),
(180, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 23:25:28'),
(181, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 23:27:02'),
(182, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 23:27:55'),
(183, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-25 23:28:53'),
(184, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 00:31:02'),
(185, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 00:32:11'),
(186, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 00:35:41'),
(187, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 00:39:17'),
(188, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 12:08:39'),
(189, 22, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 12:16:50'),
(190, 24, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 12:20:08'),
(192, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 12:33:44'),
(193, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 14:49:49'),
(194, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 15:29:06'),
(195, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 15:44:20'),
(197, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 19:49:22'),
(198, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 23:25:32'),
(199, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 23:25:44'),
(200, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-26 23:44:53'),
(201, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 13:48:22'),
(202, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 13:49:27'),
(203, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 16:03:08'),
(204, 26, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 16:04:40'),
(205, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 16:05:44'),
(254, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 16:52:44'),
(255, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 18:29:28'),
(258, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 19:52:02'),
(259, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 20:02:34'),
(260, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 20:03:08'),
(262, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 20:26:47'),
(263, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 20:43:32'),
(264, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 21:02:31'),
(267, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 21:03:13'),
(268, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 21:06:31'),
(269, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 21:06:53'),
(270, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-27 22:11:47'),
(271, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 00:54:54'),
(272, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 01:19:12'),
(273, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 02:20:22'),
(274, 25, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 14:27:34'),
(283, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-11-28 14:37:38'),
(284, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-11-28 14:37:41'),
(285, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-11-28 14:37:44'),
(286, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-11-28 14:37:45'),
(287, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-11-28 14:37:47'),
(288, 25, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Account is locked', '2025-11-28 14:38:06'),
(290, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 15:37:44'),
(292, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 16:44:39'),
(293, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-28 17:45:24'),
(296, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-29 09:37:57'),
(297, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-29 18:00:55'),
(298, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:38:42'),
(301, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:42:02'),
(302, 106, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:43:27'),
(303, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:43:47'),
(304, 106, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:44:26'),
(305, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:44:45'),
(306, 108, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 02:47:04'),
(307, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 04:11:38'),
(308, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 04:30:37'),
(309, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-11-30 04:41:58'),
(310, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-02 00:17:46'),
(311, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-02 01:00:34'),
(312, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-02 02:01:42'),
(313, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 14:27:58'),
(314, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 14:28:31'),
(315, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 15:59:40'),
(316, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 17:49:02'),
(317, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 17:49:25'),
(318, 23, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 19:17:50'),
(319, 18, 'EMAIL', NULL, NULL, NULL, 'SUCCESS', NULL, '2025-12-06 19:32:13'),
(320, 18, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-12-06 23:12:03'),
(321, 18, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-12-06 23:14:34'),
(322, 18, 'EMAIL', NULL, NULL, NULL, 'FAILED', 'Invalid password', '2025-12-06 23:14:36');

-- --------------------------------------------------------

--
-- Table structure for table `medias`
--

CREATE TABLE `medias` (
  `id` bigint(20) NOT NULL,
  `owner_user_id` bigint(20) DEFAULT NULL,
  `url` varchar(1024) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size_bytes` bigint(20) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `checksum_sha1` varchar(40) DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `variants_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variants_json`)),
  `alt_text` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medias`
--

INSERT INTO `medias` (`id`, `owner_user_id`, `url`, `mime_type`, `size_bytes`, `width`, `height`, `checksum_sha1`, `provider`, `variants_json`, `alt_text`, `created_at`, `created_by`) VALUES
(1, 18, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'image/jpeg', 150000, 800, 1200, NULL, 'unsplash', NULL, 'Ảnh thật áo thun nam', '2025-11-19 08:30:00', 18),
(2, 18, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'image/jpeg', 160000, 800, 1200, NULL, 'unsplash', NULL, 'Ảnh thật giày sneaker trắng', '2025-11-19 08:30:10', 18),
(3, NULL, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764069761/messages/ddzljbjiesy7p59hvok3.jpg', 'image/jpeg', 64247, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-25 18:22:40', 18),
(4, NULL, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764069946/messages/uef6g9wwp8odjvruyznv.jpg', 'image/jpeg', 64247, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-25 18:25:45', 22),
(5, NULL, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764069950/messages/gdsemot70onukjbnsclq.png', 'image/png', 699086, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-25 18:25:49', 22),
(6, NULL, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764088112/messages/zfzkcusmtr4xbjyhkxyo.jpg', 'image/jpeg', 64247, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-25 23:28:32', 23),
(7, NULL, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764135036/messages/vfy2dla5uu604dhchajr.jpg', 'image/jpeg', 64247, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-26 12:30:37', 24),
(8, 25, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764256580/review-images/gqzikyqt9c5qvcjok83l.jpg', 'image/jpeg', NULL, NULL, NULL, NULL, 'cloudinary', NULL, NULL, '2025-11-27 22:16:21', 25);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `thread_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `content_text` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `thread_id`, `sender_id`, `content_text`, `status`, `created_at`) VALUES
(1, 1, 18, 'alo bạn ơi', 'visible', '2025-11-25 18:22:38'),
(2, 1, 22, 'tôi đây', 'visible', '2025-11-25 18:25:43'),
(3, 1, 18, 'bạn đnag làm gì đấy', 'visible', '2025-11-25 18:32:46'),
(4, 10, 23, 'alo', 'visible', '2025-11-25 23:28:30'),
(5, 10, 18, 'hello bạn', 'visible', '2025-11-25 23:29:07'),
(6, 10, 23, 'chào bạn', 'visible', '2025-11-25 23:29:41'),
(7, 10, 23, 'bạn biết tôi không', 'visible', '2025-11-25 23:29:57'),
(8, 10, 23, 'alo', 'visible', '2025-11-25 23:57:56'),
(9, 10, 23, 'he lo', 'visible', '2025-11-25 23:58:05'),
(10, 10, 23, 'hí lô', 'visible', '2025-11-25 23:58:16'),
(11, 10, 23, 'alo', 'visible', '2025-11-25 23:58:54'),
(12, 10, 23, 'alo', 'visible', '2025-11-26 00:05:48'),
(13, 10, 23, 'bạn KHoa ơi', 'visible', '2025-11-26 00:16:22'),
(14, 10, 23, 'alo bạn', 'visible', '2025-11-26 00:16:38'),
(15, 10, 18, 'alo bạn', 'visible', '2025-11-26 00:18:01'),
(16, 10, 18, 'hi may', 'visible', '2025-11-26 00:18:10'),
(17, 10, 23, 'lao', 'visible', '2025-11-26 00:25:17'),
(18, 10, 23, 'bạn đang làm gì đó', 'visible', '2025-11-26 00:26:51'),
(19, 10, 23, 'á á á', 'visible', '2025-11-26 00:32:26'),
(21, 10, 18, 'chuyện chi đó', 'visible', '2025-11-26 00:55:01'),
(22, 10, 18, 'có gì không', 'visible', '2025-11-26 00:55:13'),
(23, 10, 18, 'alo', 'visible', '2025-11-26 00:55:57'),
(24, 10, 23, 'có á', 'visible', '2025-11-26 00:57:20'),
(25, 10, 23, 'bạn hiểu không', 'visible', '2025-11-26 00:57:33'),
(26, 10, 18, 'alo', 'visible', '2025-11-26 01:03:17'),
(27, 10, 18, 'hí', 'visible', '2025-11-26 01:04:18'),
(28, 10, 23, 'thì đó', 'visible', '2025-11-26 01:04:39'),
(29, 10, 18, 'hí', 'visible', '2025-11-26 01:05:24'),
(30, 10, 18, 'hí lô', 'visible', '2025-11-26 01:12:30'),
(31, 10, 18, 'helo me', 'visible', '2025-11-26 01:15:52'),
(32, 10, 23, 'alo', 'visible', '2025-11-26 01:16:00'),
(33, 10, 23, 'hí lô', 'visible', '2025-11-26 01:16:18'),
(34, 10, 23, 'cần chi không', 'visible', '2025-11-26 01:21:59'),
(35, 10, 23, 'phải ha', 'visible', '2025-11-26 01:22:18'),
(36, 10, 23, 'đúng chưa', 'visible', '2025-11-26 01:22:31'),
(38, 17, 24, 'alo bạn ơi', 'visible', '2025-11-26 12:32:55');

-- --------------------------------------------------------

--
-- Table structure for table `message_media`
--

CREATE TABLE `message_media` (
  `message_id` bigint(20) NOT NULL,
  `media_id` bigint(20) NOT NULL,
  `sort_order` int(11) DEFAULT 1,
  `caption` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_media`
--

INSERT INTO `message_media` (`message_id`, `media_id`, `sort_order`, `caption`) VALUES
(1, 3, 0, NULL),
(2, 4, 0, NULL),
(2, 5, 1, NULL),
(4, 6, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `message_reads`
--

CREATE TABLE `message_reads` (
  `message_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `read_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_reads`
--

INSERT INTO `message_reads` (`message_id`, `user_id`, `read_at`) VALUES
(1, 18, '2025-11-25 18:22:40'),
(3, 18, '2025-11-25 18:32:46'),
(2, 18, '2025-11-25 18:38:20'),
(4, 18, '2025-11-25 23:28:57'),
(5, 18, '2025-11-25 23:29:07'),
(6, 18, '2025-11-25 23:29:48'),
(7, 18, '2025-11-25 23:30:05'),
(8, 18, '2025-11-25 23:58:19'),
(9, 18, '2025-11-25 23:58:19'),
(10, 18, '2025-11-25 23:58:19'),
(11, 18, '2025-11-26 00:05:57'),
(12, 18, '2025-11-26 00:05:57'),
(13, 18, '2025-11-26 00:17:49'),
(14, 18, '2025-11-26 00:17:49'),
(15, 18, '2025-11-26 00:18:01'),
(16, 18, '2025-11-26 00:18:10'),
(17, 18, '2025-11-26 00:26:39'),
(18, 18, '2025-11-26 00:27:02'),
(19, 18, '2025-11-26 00:54:53'),
(21, 18, '2025-11-26 00:55:01'),
(22, 18, '2025-11-26 00:55:13'),
(23, 18, '2025-11-26 00:55:57'),
(24, 18, '2025-11-26 00:57:26'),
(26, 18, '2025-11-26 01:03:17'),
(27, 18, '2025-11-26 01:04:18'),
(29, 18, '2025-11-26 01:05:24'),
(30, 18, '2025-11-26 01:12:30'),
(31, 18, '2025-11-26 01:15:52'),
(25, 18, '2025-11-26 01:16:08'),
(28, 18, '2025-11-26 01:16:08'),
(32, 18, '2025-11-26 01:16:08'),
(33, 18, '2025-11-26 01:21:49'),
(34, 18, '2025-11-26 01:22:23'),
(35, 18, '2025-11-26 01:22:23'),
(38, 18, '2025-11-26 12:33:57'),
(36, 18, '2025-11-28 01:59:00'),
(2, 22, '2025-11-25 18:25:49'),
(4, 23, '2025-11-25 23:28:32'),
(5, 23, '2025-11-25 23:29:23'),
(6, 23, '2025-11-25 23:29:41'),
(7, 23, '2025-11-25 23:29:57'),
(8, 23, '2025-11-25 23:57:56'),
(9, 23, '2025-11-25 23:58:05'),
(10, 23, '2025-11-25 23:58:16'),
(11, 23, '2025-11-25 23:58:54'),
(12, 23, '2025-11-26 00:05:48'),
(13, 23, '2025-11-26 00:16:22'),
(14, 23, '2025-11-26 00:16:38'),
(15, 23, '2025-11-26 00:19:15'),
(16, 23, '2025-11-26 00:19:15'),
(17, 23, '2025-11-26 00:25:17'),
(18, 23, '2025-11-26 00:26:51'),
(19, 23, '2025-11-26 00:32:26'),
(21, 23, '2025-11-26 00:55:07'),
(22, 23, '2025-11-26 00:55:26'),
(24, 23, '2025-11-26 00:57:20'),
(25, 23, '2025-11-26 00:57:33'),
(23, 23, '2025-11-26 01:01:53'),
(26, 23, '2025-11-26 01:03:19'),
(27, 23, '2025-11-26 01:04:35'),
(28, 23, '2025-11-26 01:04:39'),
(29, 23, '2025-11-26 01:12:18'),
(30, 23, '2025-11-26 01:15:42'),
(32, 23, '2025-11-26 01:16:00'),
(33, 23, '2025-11-26 01:16:18'),
(34, 23, '2025-11-26 01:21:59'),
(35, 23, '2025-11-26 01:22:18'),
(36, 23, '2025-11-26 01:22:31'),
(31, 23, '2025-11-30 04:37:31'),
(38, 24, '2025-11-26 12:32:55');

-- --------------------------------------------------------

--
-- Table structure for table `message_threads`
--

CREATE TABLE `message_threads` (
  `id` bigint(20) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message_threads`
--

INSERT INTO `message_threads` (`id`, `subject`, `created_by`, `created_at`) VALUES
(1, 'DIRECT:18:22', 18, '2025-11-25 18:22:15'),
(10, 'SUPPORT:23', 23, '2025-11-25 23:28:17'),
(11, 'SUPPORT:22', 22, '2025-11-26 12:16:51'),
(17, 'SUPPORT:24', 24, '2025-11-26 12:32:33'),
(18, 'SUPPORT:18', 18, '2025-11-26 19:49:22'),
(19, 'SUPPORT:18', 18, '2025-11-26 19:49:22'),
(20, 'SUPPORT:25', 25, '2025-11-27 16:03:09'),
(21, 'SUPPORT:25', 25, '2025-11-27 16:03:09'),
(22, 'SUPPORT:26', 26, '2025-11-27 16:04:40'),
(23, 'SUPPORT:26', 26, '2025-11-27 16:04:40');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `order_code` varchar(40) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(20) NOT NULL DEFAULT 'unpaid',
  `payment_expires_at` datetime DEFAULT NULL,
  `shipping_status` varchar(20) NOT NULL DEFAULT 'unfulfilled',
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'VND',
  `note` varchar(500) DEFAULT NULL,
  `snapshot_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`snapshot_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `cancelled_at` datetime DEFAULT NULL,
  `cancel_reason` varchar(200) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `coupon_discount` decimal(38,2) DEFAULT NULL,
  `coupon_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `user_id`, `address_id`, `status`, `payment_status`, `payment_expires_at`, `shipping_status`, `subtotal`, `discount_total`, `tax_total`, `shipping_fee`, `grand_total`, `currency`, `note`, `snapshot_json`, `created_at`, `updated_at`, `cancelled_at`, `cancel_reason`, `coupon_code`, `coupon_discount`, `coupon_id`) VALUES
(1, 'ORD000001', 18, 1, 'confirmed', 'paid', '2025-11-19 09:00:00', 'unfulfilled', 997000.00, 0.00, 0.00, 30000.00, 1027000.00, 'VND', 'Đơn hàng demo', NULL, '2025-11-19 08:20:00', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'ORD1763731310546', 18, 1, 'cancelled', 'expired', '2025-11-21 20:31:50', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:21:50', '2025-11-21 20:32:02', '2025-11-21 20:32:01', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(3, 'ORD1763731702242', 18, 1, 'cancelled', 'expired', '2025-11-21 20:38:22', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:28:22', '2025-11-21 20:38:43', '2025-11-21 20:38:43', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(4, 'ORD1763731994073', 18, 1, 'cancelled', 'expired', '2025-11-21 20:43:14', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:33:14', '2025-11-21 20:43:43', '2025-11-21 20:43:43', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(5, 'ORD1763732171466', 18, 1, 'cancelled', 'expired', '2025-11-21 20:46:11', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:36:11', '2025-11-21 20:46:43', '2025-11-21 20:46:43', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(6, 'ORD1763732327527', 18, 1, 'cancelled', 'expired', '2025-11-21 20:48:47', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:38:47', '2025-11-21 20:49:43', '2025-11-21 20:49:43', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(7, 'ORD1763732420312', 18, 1, 'cancelled', 'expired', '2025-11-21 20:50:20', 'unfulfilled', 1396000.00, 0.00, 10000.00, 0.00, 1406000.00, 'VND', 'Test checkout PayOS', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":1396000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":1406000,\"couponCode\":null,\"note\":\"Test checkout PayOS\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":2},{\"productId\":2,\"variantId\":5,\"unitPrice\":399000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-11-21 20:40:20', '2025-11-21 20:50:43', '2025-11-21 20:50:43', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(8, 'ORD1763734015965', 18, 1, 'cancelled', 'expired', '2025-11-21 21:16:55', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:06:55', '2025-11-21 21:17:44', '2025-11-21 21:17:44', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(9, 'ORD1763734305226', 18, 1, 'cancelled', 'expired', '2025-11-21 21:21:45', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:11:45', '2025-11-21 21:22:44', '2025-11-21 21:22:44', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(10, 'ORD1763734889330', 18, 1, 'cancelled', 'expired', '2025-11-21 21:31:29', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:21:29', '2025-11-21 21:33:53', '2025-11-21 21:33:53', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(11, 'ORD1763734995416', 18, 1, 'pending', 'unpaid', NULL, 'unfulfilled', 199000.00, 0.00, 10000.00, 10000.00, 219000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"COD\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":10000,\"grandTotal\":219000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:23:15', '2025-11-21 21:23:15', NULL, NULL, NULL, NULL, NULL),
(12, 'ORD1763735003752', 18, 1, 'pending', 'unpaid', NULL, 'unfulfilled', 199000.00, 0.00, 10000.00, 10000.00, 219000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"COD\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":10000,\"grandTotal\":219000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:23:23', '2025-11-21 21:23:23', NULL, NULL, NULL, NULL, NULL),
(13, 'ORD1763735041470', 18, 1, 'pending', 'unpaid', NULL, 'unfulfilled', 199000.00, 0.00, 10000.00, 10000.00, 219000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"COD\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":10000,\"grandTotal\":219000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:24:01', '2025-11-21 21:24:01', NULL, NULL, NULL, NULL, NULL),
(14, 'ORD1763735086103', 18, 1, 'cancelled', 'expired', '2025-11-21 21:34:46', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:24:46', '2025-11-21 21:34:53', '2025-11-21 21:34:53', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(15, 'ORD1763735649436', 18, 1, 'cancelled', 'expired', '2025-11-21 21:44:09', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:34:09', '2025-11-21 21:45:09', '2025-11-21 21:45:09', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(16, 'ORD1763736316864', 18, 1, 'cancelled', 'expired', '2025-11-21 21:55:16', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 21:45:16', '2025-11-21 21:56:09', '2025-11-21 21:56:09', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(17, 'ORD1763737909904', 18, 1, 'cancelled', 'refund_requested', '2025-11-21 22:21:49', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 22:11:49', '2025-11-23 03:05:31', '2025-11-23 03:05:31', 'Tôi đổi ý', NULL, NULL, NULL),
(18, 'ORD1763738128293', 18, 1, 'cancelled', 'refunded', '2025-11-21 22:25:28', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-21 22:15:28', '2025-11-22 14:58:47', '2025-11-22 14:58:46', 'Người dùng hủy đơn sau khi đã thanh toán (đã hoàn tiền)', NULL, NULL, NULL),
(19, 'ORD1763798455772', 18, 1, 'cancelled', 'refunded', '2025-11-22 15:10:55', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-22 15:00:55', '2025-11-22 15:01:51', '2025-11-22 15:01:51', 'Người dùng hủy đơn sau khi đã thanh toán (đã hoàn tiền)', NULL, NULL, NULL),
(20, 'ORD1763833630439', 18, 1, 'cancelled', 'refund_requested', '2025-11-23 00:57:10', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 00:47:10', '2025-11-23 00:50:42', '2025-11-23 00:50:42', 'Tôi đổi ý', NULL, NULL, NULL),
(21, 'ORD1763834538277', 18, 1, 'cancelled', 'refund_requested', '2025-11-23 01:12:18', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 01:02:18', '2025-11-23 01:03:55', '2025-11-23 01:03:55', 'Tôi đổi ý', NULL, NULL, NULL),
(22, 'ORD1763835054049', 18, 1, 'cancelled', 'refunded', '2025-11-23 01:20:54', 'unfulfilled', 199000.00, 0.00, 10000.00, 10000.00, 219000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":10000,\"grandTotal\":219000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 01:10:54', '2025-11-23 01:26:43', '2025-11-23 01:11:20', 'Tôi đổi ý', NULL, NULL, NULL),
(23, 'ORD1763836731887', 18, 1, 'processing', 'paid', '2025-11-23 01:48:51', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 01:38:51', '2025-11-23 01:39:52', NULL, NULL, NULL, NULL, NULL),
(24, 'ORD1763837330907', 18, 1, 'cancelled', 'refunded', '2025-11-23 01:58:50', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 01:48:50', '2025-11-23 01:58:52', '2025-11-23 01:49:59', 'Tôi đổi ý', NULL, NULL, NULL),
(25, 'ORD1763838063378', 18, 1, 'cancelled', 'refunded', '2025-11-23 02:11:03', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 02:01:03', '2025-11-23 02:03:12', '2025-11-23 02:01:56', 'Tôi đổi ý', NULL, NULL, NULL),
(26, 'ORD1763839766949', 18, 1, 'processing', 'paid', '2025-11-23 02:39:26', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 02:29:26', '2025-11-23 02:30:17', NULL, NULL, NULL, NULL, NULL),
(27, 'ORD1763842167837', 18, 1, 'cancelled', 'expired', '2025-11-23 03:19:27', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 03:09:27', '2025-11-23 14:27:59', '2025-11-23 14:27:59', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(28, 'ORD1763886750849', 18, 1, 'CANCELLED', 'refunded', '2025-11-23 15:42:30', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 15:32:30', '2025-11-23 15:35:51', '2025-11-23 15:33:53', 'Tôi đổi ý', NULL, NULL, NULL),
(29, 'ORD1763887108759', 18, 1, 'cancelled', 'expired', '2025-11-23 15:48:28', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 15:38:28', '2025-11-23 15:53:54', '2025-11-23 15:53:54', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(30, 'ORD1763888110683', 18, 1, 'cancelled', 'expired', '2025-11-23 16:05:10', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 15:55:10', '2025-11-23 16:05:55', '2025-11-23 16:05:55', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(31, 'ORD1763889049715', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:20:49', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:10:49', '2025-11-23 16:11:11', '2025-11-23 16:11:11', 'Tôi đổi ý', NULL, NULL, NULL),
(32, 'ORD1763889153875', 18, 1, 'cancelled', 'expired', '2025-11-23 16:22:33', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:12:33', '2025-11-23 16:22:55', '2025-11-23 16:22:55', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(33, 'ORD1763889760330', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:32:40', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:22:40', '2025-11-23 16:31:06', '2025-11-23 16:31:06', 'Tôi đổi ý', NULL, NULL, NULL),
(34, 'ORD1763890137865', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:38:57', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:28:57', '2025-11-23 16:31:01', '2025-11-23 16:31:01', 'Tôi đổi ý', NULL, NULL, NULL),
(35, 'ORD1763890274685', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:41:14', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:31:14', '2025-11-23 16:34:33', '2025-11-23 16:34:33', 'Tôi đổi ý', NULL, NULL, NULL),
(37, 'ORD1763890547393', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:45:47', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:35:47', '2025-11-23 16:41:31', '2025-11-23 16:41:31', 'Tôi đổi ý', NULL, NULL, NULL),
(38, 'ORD1763890902488', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:51:42', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:41:42', '2025-11-23 16:47:59', '2025-11-23 16:47:59', 'Tôi đổi ý', NULL, NULL, NULL),
(39, 'ORD1763891300013', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 16:58:20', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:48:20', '2025-11-23 16:57:03', '2025-11-23 16:57:03', 'Tôi đổi ý', NULL, NULL, NULL),
(40, 'ORD1763891833099', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 17:07:13', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 16:57:13', '2025-11-23 17:07:24', '2025-11-23 17:07:24', 'Tôi đổi ý', NULL, NULL, NULL),
(41, 'ORD1763892452897', 18, 1, 'CANCELLED', 'unpaid', '2025-11-23 17:17:32', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 17:07:32', '2025-11-23 17:10:39', '2025-11-23 17:10:39', 'Tôi đổi ý', NULL, NULL, NULL),
(42, 'ORD1763892649305', 18, 1, 'cancelled', 'expired', '2025-11-23 17:20:49', 'unfulfilled', 199000.00, 0.00, 10000.00, 10000.00, 219000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":10000,\"grandTotal\":219000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 17:10:49', '2025-11-23 17:20:55', '2025-11-23 17:20:55', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(43, 'ORD1763893318685', 18, 1, 'CANCELLED', 'refunded', '2025-11-23 17:31:58', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 17:21:58', '2025-11-23 17:32:24', '2025-11-23 17:25:54', 'Tôi đổi ý', NULL, NULL, NULL),
(45, 'ORD1763894585675', 18, 1, 'cancelled', 'expired', '2025-11-23 17:53:05', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":1,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-23 17:43:05', '2025-11-23 18:09:24', '2025-11-23 18:09:24', 'Thanh toán quá hạn 10 phút', NULL, NULL, NULL),
(46, 'ORD1764174405202', 23, 3, 'CANCELLED', 'refunded', '2025-11-26 23:36:45', 'unfulfilled', 399000.00, 30000.00, 10000.00, 0.00, 379000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"PAYOS\",\"subtotal\":399000,\"discountTotal\":30000,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":379000,\"couponCode\":\"FREESHIP30\",\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-26 23:26:45', '2025-11-26 23:32:46', '2025-11-26 23:30:57', 'Tôi đổi ý', NULL, NULL, NULL),
(47, 'ORD1764175191235', 23, 3, 'CANCELLED', 'unpaid', '2025-11-26 23:49:51', 'unfulfilled', 399000.00, 0.00, 10000.00, 0.00, 409000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"PAYOS\",\"subtotal\":399000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":409000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-26 23:39:51', '2025-11-26 23:40:11', '2025-11-26 23:40:11', 'Admin hủy đơn', NULL, NULL, NULL),
(55, 'ORD1764175595702', 23, 3, 'CANCEL_REQUESTED', 'refund_requested', '2025-11-26 23:56:35', 'unfulfilled', 399000.00, 0.00, 10000.00, 0.00, 409000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"PAYOS\",\"subtotal\":399000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":409000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-26 23:46:35', '2025-11-26 23:53:51', '2025-11-26 23:48:34', 'Tôi đổi ý', NULL, NULL, NULL),
(56, 'ORD1764176166382', 23, 3, 'COMPLETED', 'unpaid', '2025-11-27 00:06:06', 'delivered', 399000.00, 0.00, 10000.00, 0.00, 409000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"PAYOS\",\"subtotal\":399000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":409000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-26 23:56:06', '2025-11-27 00:00:32', NULL, NULL, NULL, NULL, NULL),
(57, 'ORD1764176524915', 23, 3, 'CANCELLED', 'unpaid', '2025-11-27 00:12:04', 'unfulfilled', 399000.00, 0.00, 10000.00, 0.00, 409000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"PAYOS\",\"subtotal\":399000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":409000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-27 00:02:04', '2025-11-27 00:03:27', '2025-11-27 00:03:27', 'Admin hủy đơn', NULL, NULL, NULL),
(58, 'ORD1764226157219', 23, 3, 'CONFIRMED', 'unpaid', NULL, 'unfulfilled', 399000.00, 0.00, 10000.00, 0.00, 409000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"COD\",\"subtotal\":399000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":409000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":1}]}', '2025-11-27 13:49:17', '2025-11-27 13:49:32', NULL, NULL, NULL, NULL, NULL),
(59, 'ORD1764254640528', 25, 4, 'COMPLETED', 'paid', '2025-11-27 21:54:00', 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', 'no', '{\"addressId\":4,\"paymentMethod\":\"PAYOS\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"no\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-11-27 21:44:00', '2025-11-27 21:47:40', NULL, NULL, NULL, NULL, NULL),
(60, 'ORD1765006125177', 23, 3, 'COMPLETED', 'unpaid', NULL, 'delivered', 4890000.00, 0.00, 10000.00, 0.00, 4900000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"COD\",\"subtotal\":4890000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":4900000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":2,\"variantId\":4,\"unitPrice\":399000,\"quantity\":5},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":4},{\"productId\":4,\"variantId\":27,\"unitPrice\":499000,\"quantity\":1}]}', '2025-12-06 14:28:45', '2025-12-06 14:28:59', NULL, NULL, NULL, NULL, NULL),
(61, 'ORD1765006190503', 23, 3, 'COMPLETED', 'unpaid', NULL, 'delivered', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"COD\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-12-06 14:29:50', '2025-12-06 14:30:02', NULL, NULL, NULL, NULL, NULL),
(62, 'ORD1765006243238', 23, 3, 'CANCELLED', 'unpaid', NULL, 'unfulfilled', 199000.00, 0.00, 10000.00, 0.00, 209000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"COD\",\"subtotal\":199000,\"discountTotal\":0,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":209000,\"couponCode\":null,\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1}]}', '2025-12-06 14:30:43', '2025-12-06 14:31:01', '2025-12-06 14:31:01', 'Tôi đổi ý', NULL, NULL, NULL),
(63, 'ORD1765007762796', 23, 3, 'COMPLETED', 'unpaid', NULL, 'delivered', 798000.00, 798000.00, 10000.00, 0.00, 10000.00, 'VND', '', '{\"addressId\":3,\"paymentMethod\":\"COD\",\"subtotal\":798000,\"discountTotal\":798000,\"taxTotal\":10000,\"shippingFee\":0,\"grandTotal\":10000,\"couponCode\":\"WELCOME1\",\"note\":\"\",\"items\":[{\"productId\":1,\"variantId\":2,\"unitPrice\":199000,\"quantity\":1},{\"productId\":3,\"variantId\":6,\"unitPrice\":599000,\"quantity\":1}]}', '2025-12-06 14:56:02', '2025-12-06 18:38:43', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `line_total` decimal(12,2) NOT NULL,
  `snapshot_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`snapshot_json`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `qty`, `unit_price`, `discount_amount`, `tax_amount`, `line_total`, `snapshot_json`) VALUES
(1, 1, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(2, 1, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(3, 1, 3, 7, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(4, 2, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(5, 2, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(6, 2, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(7, 3, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(8, 3, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(9, 3, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(10, 4, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(11, 4, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(12, 4, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(13, 5, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(14, 5, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(15, 5, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(16, 6, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(17, 6, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(18, 6, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(19, 7, 1, 2, 2, 199000.00, 0.00, 0.00, 398000.00, NULL),
(20, 7, 2, 5, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(21, 7, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL),
(22, 8, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(23, 9, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(24, 10, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(25, 11, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(26, 12, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(27, 13, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(28, 14, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(29, 15, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(30, 16, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(31, 17, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(32, 18, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(33, 19, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(34, 20, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(35, 21, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(36, 22, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(37, 23, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(38, 24, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(39, 25, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(40, 26, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(41, 27, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(42, 28, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(43, 29, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(44, 30, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(45, 31, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(46, 32, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(47, 33, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(48, 34, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(49, 35, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(51, 37, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(52, 38, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(53, 39, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(54, 40, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(55, 41, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(56, 42, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(57, 43, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(59, 45, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(60, 46, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(61, 47, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(69, 55, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(70, 56, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(71, 57, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(72, 58, 2, 4, 1, 399000.00, 0.00, 0.00, 399000.00, NULL),
(73, 59, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(74, 60, 2, 4, 5, 399000.00, 0.00, 0.00, 1995000.00, NULL),
(75, 60, 3, 6, 4, 599000.00, 0.00, 0.00, 2396000.00, NULL),
(76, 60, 4, 27, 1, 499000.00, 0.00, 0.00, 499000.00, NULL),
(77, 61, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(78, 62, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(79, 63, 1, 2, 1, 199000.00, 0.00, 0.00, 199000.00, NULL),
(80, 63, 3, 6, 1, 599000.00, 0.00, 0.00, 599000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `provider` varchar(50) NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `currency` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL,
  `txn_ref` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `webhook_received_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `provider`, `amount`, `currency`, `status`, `txn_ref`, `paid_at`, `webhook_received_at`, `created_at`) VALUES
(1, 2, 'PAYOS', 1406000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-11-21 20:21:50'),
(2, 3, 'PAYOS', 1406000.00, 'VND', 'PENDING', '', NULL, NULL, '2025-11-21 20:28:22'),
(3, 4, 'PAYOS', 1406000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-11-21 20:33:14'),
(4, 5, 'PAYOS', 1406000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-11-21 20:36:11'),
(5, 6, 'PAYOS', 1406000.00, 'VND', 'PENDING', '0a3c98083d2e410da2bf2d97a350cd85', NULL, NULL, '2025-11-21 20:38:47'),
(6, 7, 'PAYOS', 1406000.00, 'VND', 'PENDING', '322dec32aeeb447fa81132bff680660b', NULL, NULL, '2025-11-21 20:40:20'),
(7, 8, 'PAYOS', 209000.00, 'VND', 'PENDING', 'eac7c22ae24b445a9b743814218b3824', NULL, NULL, '2025-11-21 21:06:55'),
(8, 9, 'PAYOS', 209000.00, 'VND', 'PENDING', 'dd538a26577443119fb2237cd82e76ad', NULL, NULL, '2025-11-21 21:11:45'),
(9, 10, 'PAYOS', 209000.00, 'VND', 'PENDING', 'b936ad2dbd774ccfadb5ec5b115d8f9c', NULL, NULL, '2025-11-21 21:21:29'),
(10, 14, 'PAYOS', 209000.00, 'VND', 'PENDING', '9e4e45717cc847938efefa71f3162fba', NULL, NULL, '2025-11-21 21:24:46'),
(11, 15, 'PAYOS', 209000.00, 'VND', 'PENDING', '4d3287a7c1ef4f7984cc5f6bca5a46ac', NULL, NULL, '2025-11-21 21:34:09'),
(12, 16, 'PAYOS', 209000.00, 'VND', 'PENDING', '25373bfe4afe4c33a2078955cafee706', NULL, NULL, '2025-11-21 21:45:16'),
(13, 17, 'PAYOS', 209000.00, 'VND', 'PAID', '538088e8c6b045f39be188b6024fba52', '2025-11-21 22:15:10', NULL, '2025-11-21 22:11:49'),
(14, 18, 'PAYOS', 209000.00, 'VND', 'REFUNDED', '2f2a621bf95f49c3840c1f69dbd44463', '2025-11-21 22:15:48', NULL, '2025-11-21 22:15:28'),
(15, 19, 'PAYOS', 209000.00, 'VND', 'REFUNDED', '2a666611fcc445efb8acdf1a00b705f8', '2025-11-22 15:01:26', NULL, '2025-11-22 15:00:55'),
(16, 20, 'PAYOS', 209000.00, 'VND', 'PAID', '07059f236ca141dd84f1542724516f4f', '2025-11-23 00:48:01', NULL, '2025-11-23 00:47:10'),
(17, 21, 'PAYOS', 209000.00, 'VND', 'PAID', '3736de6b5f8b41ecb726eb5f43bc680a', '2025-11-23 01:03:19', NULL, '2025-11-23 01:02:18'),
(18, 22, 'PAYOS', 219000.00, 'VND', 'PAID', '1b47275e2a324834a9386e556e95aff2', '2025-11-23 01:11:14', NULL, '2025-11-23 01:10:54'),
(19, 23, 'PAYOS', 209000.00, 'VND', 'PAID', '1429f2b79e04483cb24501c1cc448874', '2025-11-23 01:39:52', NULL, '2025-11-23 01:38:51'),
(20, 24, 'PAYOS', 209000.00, 'VND', 'PAID', '3313b2d892624b3d827e51ee8a1e8f08', '2025-11-23 01:49:11', NULL, '2025-11-23 01:48:50'),
(21, 25, 'PAYOS', 209000.00, 'VND', 'PAID', 'eabedf8748c1421ca783575ae1140777', '2025-11-23 02:01:34', NULL, '2025-11-23 02:01:03'),
(22, 26, 'PAYOS', 209000.00, 'VND', 'PAID', '72ef040c509144d0816333ff3fddb808', '2025-11-23 02:30:17', NULL, '2025-11-23 02:29:26'),
(23, 27, 'PAYOS', 209000.00, 'VND', 'PENDING', '66f25b498c834e649c89eb7ac0013e69', NULL, NULL, '2025-11-23 03:09:27'),
(28, 28, 'PAYOS', 209000.00, 'VND', 'PAID', '6e9dacbe9c884bde85012facf4a70779', '2025-11-23 15:33:01', NULL, '2025-11-23 15:32:30'),
(29, 29, 'PAYOS', 209000.00, 'VND', 'PENDING', '219a57b3b05d4376a88a86a7b5aa857d', NULL, NULL, '2025-11-23 15:38:28'),
(30, 30, 'PAYOS', 209000.00, 'VND', 'PENDING', '89744d31ead14d0a809df47763169cb2', NULL, NULL, '2025-11-23 15:55:10'),
(31, 31, 'PAYOS', 209000.00, 'VND', 'PENDING', 'd945aeb0cb31459298de301a68e1fee2', NULL, NULL, '2025-11-23 16:10:49'),
(35, 32, 'PAYOS', 209000.00, 'VND', 'PENDING', 'b3550a35a9194ff29bd6b506d2463f93', NULL, NULL, '2025-11-23 16:12:33'),
(37, 33, 'PAYOS', 209000.00, 'VND', 'PENDING', 'b669e4861ccb4ef9bf0d0186fb81a977', NULL, NULL, '2025-11-23 16:22:40'),
(41, 34, 'PAYOS', 209000.00, 'VND', 'PENDING', '4c6deaf06de7447790b39f93a9f0ecde', NULL, NULL, '2025-11-23 16:28:57'),
(44, 35, 'PAYOS', 209000.00, 'VND', 'PENDING', '2a50bbc4539046c8b904a703e191f9d9', NULL, NULL, '2025-11-23 16:31:14'),
(47, 37, 'PAYOS', 209000.00, 'VND', 'PENDING', '11f6070e2ba24828a84e6f56fde58a3b', NULL, NULL, '2025-11-23 16:35:47'),
(51, 38, 'PAYOS', 209000.00, 'VND', 'PENDING', '81296818dd7a4e6d9cea38a671d48241', NULL, NULL, '2025-11-23 16:41:42'),
(53, 39, 'PAYOS', 209000.00, 'VND', 'PENDING', '7b8cc4cbda704395a7875d13cfaa7e01', NULL, NULL, '2025-11-23 16:48:20'),
(57, 40, 'PAYOS', 209000.00, 'VND', 'PENDING', '456b8aa6d5b342ab8c5bae0f1c0cc397', NULL, NULL, '2025-11-23 16:57:13'),
(58, 41, 'PAYOS', 209000.00, 'VND', 'PENDING', '6ee0e25569f5427b86ab888fefb7efda', NULL, NULL, '2025-11-23 17:07:32'),
(59, 42, 'PAYOS', 219000.00, 'VND', 'PENDING', '49ffe79b633e49c3a4661c4315e01bf6', NULL, NULL, '2025-11-23 17:10:49'),
(60, 43, 'PAYOS', 209000.00, 'VND', 'PAID', '6723671428254254ae63b224acc64a3d', '2025-11-23 17:24:13', NULL, '2025-11-23 17:21:58'),
(61, 45, 'PAYOS', 209000.00, 'VND', 'PENDING', '9e9f4556074142dda136efaa620cbe73', NULL, NULL, '2025-11-23 17:43:05'),
(62, 46, 'PAYOS', 379000.00, 'VND', 'PAID', 'c75452ab92ef4b579acfa336f6bbd82b', '2025-11-26 23:28:35', NULL, '2025-11-26 23:26:45'),
(63, 47, 'PAYOS', 409000.00, 'VND', 'PENDING', '1f96da737dc442a8b97594428f751c0c', NULL, NULL, '2025-11-26 23:39:51'),
(71, 55, 'PAYOS', 409000.00, 'VND', 'PAID', '2b187b60d48747eb98c0fada9c35ba04', '2025-11-26 23:48:16', NULL, '2025-11-26 23:46:35'),
(72, 56, 'PAYOS', 409000.00, 'VND', 'PENDING', '1e59b17901294bfea2804d11d06102cb', NULL, NULL, '2025-11-26 23:56:06'),
(73, 57, 'PAYOS', 409000.00, 'VND', 'PENDING', 'a526bca0efea4345b075fd3ae70566c6', NULL, NULL, '2025-11-27 00:02:04'),
(74, 59, 'PAYOS', 209000.00, 'VND', 'PAID', '7b8e15c726204a15979bfa726af24676', '2025-11-27 21:45:31', NULL, '2025-11-27 21:44:00'),
(75, 60, 'COD', 4900000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-12-06 14:28:45'),
(76, 61, 'COD', 209000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-12-06 14:29:50'),
(77, 62, 'COD', 209000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-12-06 14:30:43'),
(78, 63, 'COD', 10000.00, 'VND', 'PENDING', NULL, NULL, NULL, '2025-12-06 14:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(120) NOT NULL,
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config_json`)),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `code` varchar(128) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `code`, `description`) VALUES
(1, 'user:read', 'View users'),
(2, 'user:create', 'Create users'),
(3, 'user:update', 'Update users'),
(4, 'user:delete', 'Delete users'),
(5, 'role:read', 'View roles'),
(6, 'role:create', 'Create roles'),
(7, 'role:update', 'Update roles'),
(8, 'role:delete', 'Delete roles'),
(9, 'role:assign', 'Assign roles to users'),
(10, 'permission:read', 'View permissions'),
(11, 'user:invite', 'Invite staff');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `brand_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO title',
  `meta_description` varchar(255) DEFAULT NULL,
  `meta_keywords` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL COMMENT 'Cotton 100%, Polyester, Denim',
  `care_instructions` varchar(255) DEFAULT NULL,
  `country_of_origin` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Sản phẩm nổi bật',
  `view_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượt xem',
  `sold_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng đã bán',
  `base_price` decimal(38,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `brand_id`, `name`, `slug`, `description`, `meta_title`, `meta_description`, `meta_keywords`, `tags`, `material`, `care_instructions`, `country_of_origin`, `is_featured`, `view_count`, `sold_count`, `base_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, 'Áo thun nam basic cổ tròn', 'ao-thun-nam-basic-co-tron', 'Áo thun nam basic cổ tròn, chất liệu cotton 100%, form regular, thoáng mát.', 'Áo thun nam basic cotton cổ tròn', 'Áo thun nam basic cotton 100% thoáng mát, nhiều màu lựa chọn.', 'ao thun nam, ao thun basic, ao thun cotton', 'trending,new-arrival', 'Cotton 100%', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 151, 37, 199000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 22:59:00'),
(2, 14, 'Quần jean nam slim fit', 'quan-jean-nam-slim-fit', 'Quần jean nam dáng slim fit, co giãn nhẹ, phù hợp đi làm và đi chơi.', 'Quần jean nam slim fit co giãn', 'Quần jean slim fit, vải denim co giãn, màu xanh đậm.', 'quan jean nam, jean slim fit', 'bestseller', 'Denim co giãn', 'Giặt máy, lộn trái khi giặt, tránh phơi trực tiếp dưới nắng gắt.', 'Vietnam', 1, 100, 33, 399000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 18:26:06'),
(3, 16, 'Giày sneaker trắng classic', 'giay-sneaker-trang-classic', 'Giày sneaker trắng đơn giản, dễ phối đồ, đế cao su êm ái.', 'Giày sneaker trắng classic', 'Giày sneaker trắng, thiết kế basic, phù hợp đi học, đi chơi.', 'giay sneaker, sneaker trang', 'trending,bestseller', 'Da tổng hợp, đế cao su', 'Lau bằng khăn ẩm, tránh ngâm nước lâu, không phơi trực tiếp nắng gắt.', 'China', 1, 150, 65, 599000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 18:38:43'),
(4, 5, 'Bộ thể thao nam Adidas', 'bo-the-thao-nam-adidas', 'Bộ thể thao nam Adidas chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Bộ thể thao nam Adidas', 'Bộ thể thao nam Adidas chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'bo, the, thao, nam, adidas', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 1, 499000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 14:29:00'),
(5, 6, 'Áo thun nữ basic cổ tròn', 'ao-thun-nu-basic-co-tron', 'Áo thun nữ basic cổ tròn chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo thun nữ basic cổ tròn', 'Áo thun nữ basic cổ tròn chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, thun, nu, basic, co, tron', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 199000.00, 'active', '2025-11-19 08:00:00', NULL),
(6, 7, 'Áo sơ mi nữ công sở', 'ao-so-mi-nu-cong-so', 'Áo sơ mi nữ công sở chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo sơ mi nữ công sở', 'Áo sơ mi nữ công sở chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, so, mi, nu, cong, so', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 2, 0, 299000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 17:52:07'),
(7, 8, 'Áo cardigan nữ dáng dài', 'ao-cardigan-nu-dang-dai', 'Áo cardigan nữ dáng dài chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo cardigan nữ dáng dài', 'Áo cardigan nữ dáng dài chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, cardigan, nu, dang, dai', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 349000.00, 'active', '2025-11-19 08:00:00', NULL),
(8, 9, 'Quần jean nữ basic', 'quan-jean-nu-basic', 'Quần jean nữ basic chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Quần jean nữ basic', 'Quần jean nữ basic chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'quan, jean, nu, basic', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 399000.00, 'active', '2025-11-19 08:00:00', NULL),
(9, 10, 'Túi xách tay nữ da mềm', 'tui-xach-tay-nu-da-mem', 'Túi xách tay nữ da mềm chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Túi xách tay nữ da mềm', 'Túi xách tay nữ da mềm chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'tui, xach, tay, nu, da, mem', 'new-arrival', 'Da tổng hợp', 'Lau bằng khăn ẩm, tránh tiếp xúc hóa chất mạnh.', 'Italy', 1, 0, 0, 599000.00, 'active', '2025-11-19 08:00:00', NULL),
(10, 11, 'Ví da nữ cao cấp', 'vi-da-nu-cao-cap', 'Ví da nữ cao cấp chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Ví da nữ cao cấp', 'Ví da nữ cao cấp chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'vi, da, nu, cao, cap', 'new-arrival', 'Da tổng hợp', 'Lau bằng khăn ẩm, tránh tiếp xúc hóa chất mạnh.', 'Italy', 1, 0, 0, 499000.00, 'active', '2025-11-19 08:00:00', NULL),
(11, 12, 'Đầm dự tiệc nữ sang trọng', 'dam-du-tiec-nu-sang-trong', 'Đầm dự tiệc nữ sang trọng chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Đầm dự tiệc nữ sang trọng', 'Đầm dự tiệc nữ sang trọng chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'dam, du, tiec, nu, sang, trong', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Italy', 1, 4, 0, 699000.00, 'active', '2025-11-19 08:00:00', '2025-12-06 18:13:59'),
(12, 13, 'Đầm suông nữ basic', 'dam-suong-nu-basic', 'Đầm suông nữ basic chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Đầm suông nữ basic', 'Đầm suông nữ basic chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'dam, suong, nu, basic', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Italy', 1, 0, 0, 459000.00, 'active', '2025-11-19 08:00:00', NULL),
(13, 15, 'Giày sneaker nữ thời trang', 'giay-sneaker-nu-thoi-trang', 'Giày sneaker nữ thời trang chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Giày sneaker nữ thời trang', 'Giày sneaker nữ thời trang chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'giay, sneaker, nu, thoi, trang', 'new-arrival', 'Da tổng hợp, đế cao su', 'Lau bằng khăn ẩm, tránh tiếp xúc hóa chất mạnh.', 'China', 1, 0, 0, 649000.00, 'active', '2025-11-19 08:00:00', NULL),
(14, 17, 'Giày chạy bộ nam New Balance', 'giay-chay-bo-nam-new-balance', 'Giày chạy bộ nam New Balance chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Giày chạy bộ nam New Balance', 'Giày chạy bộ nam New Balance chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'giay, chay, bo, nam, new, balance', 'new-arrival', 'Da tổng hợp, đế cao su', 'Lau bằng khăn ẩm, tránh tiếp xúc hóa chất mạnh.', 'China', 1, 0, 0, 799000.00, 'active', '2025-11-19 08:00:00', NULL),
(15, 18, 'Bộ pijama nữ dễ thương', 'bo-pijama-nu-de-thuong', 'Bộ pijama nữ dễ thương chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Bộ pijama nữ dễ thương', 'Bộ pijama nữ dễ thương chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'bo, pijama, nu, de, thuong', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 359000.00, 'active', '2025-11-19 08:00:00', NULL),
(16, 19, 'Áo polo nam Tommy Hilfiger', 'ao-polo-nam-tommy-hilfiger', 'Áo polo nam Tommy Hilfiger chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo polo nam Tommy Hilfiger', 'Áo polo nam Tommy Hilfiger chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, polo, nam, tommy, hilfiger', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 599000.00, 'active', '2025-11-19 08:00:00', NULL),
(17, 20, 'Thắt lưng da nam Hermes', 'that-lung-da-nam-hermes', 'Thắt lưng da nam Hermes chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Thắt lưng da nam Hermes', 'Thắt lưng da nam Hermes chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'that, lung, da, nam, hermes', 'new-arrival', 'Da tổng hợp', 'Lau bằng khăn ẩm, tránh tiếp xúc hóa chất mạnh.', 'Italy', 1, 0, 0, 999000.00, 'active', '2025-11-19 08:00:00', NULL),
(18, 21, 'Áo hoodie nam streetwear', 'ao-hoodie-nam-streetwear', 'Áo hoodie nam streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo hoodie nam streetwear', 'Áo hoodie nam streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, hoodie, nam, streetwear', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 549000.00, 'active', '2025-11-19 08:00:00', NULL),
(19, 22, 'Áo thun nữ streetwear', 'ao-thun-nu-streetwear', 'Áo thun nữ streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Áo thun nữ streetwear', 'Áo thun nữ streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'ao, thun, nu, streetwear', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 249000.00, 'active', '2025-11-19 08:00:00', NULL),
(20, 23, 'Bộ đồ bộ nữ streetwear', 'bo-do-bo-nu-streetwear', 'Bộ đồ bộ nữ streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'Bộ đồ bộ nữ streetwear', 'Bộ đồ bộ nữ streetwear chất liệu cao cấp, thiết kế thời trang, dễ phối đồ.', 'bo, do, bo, nu, streetwear', 'new-arrival', 'Cotton blend', 'Giặt máy nhẹ, không dùng chất tẩy mạnh, ủi ở nhiệt độ thấp.', 'Vietnam', 1, 0, 0, 429000.00, 'active', '2025-11-19 08:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 100),
(1, 102),
(1, 121),
(1, 500),
(2, 110),
(2, 111),
(2, 112),
(2, 113),
(2, 501),
(3, 400),
(3, 404),
(4, 120),
(4, 122),
(4, 232),
(4, 313),
(4, 314),
(4, 504),
(4, 600),
(4, 601),
(4, 602),
(4, 603),
(4, 604),
(4, 614),
(5, 200),
(5, 510),
(6, 202),
(6, 204),
(7, 203),
(8, 210),
(8, 211),
(8, 212),
(8, 213),
(8, 214),
(8, 612),
(9, 300),
(9, 301),
(9, 302),
(9, 303),
(9, 304),
(9, 305),
(9, 306),
(9, 307),
(10, 308),
(10, 315),
(11, 224),
(12, 220),
(12, 221),
(12, 222),
(12, 223),
(12, 225),
(12, 513),
(13, 410),
(13, 411),
(13, 412),
(13, 413),
(13, 414),
(14, 401),
(14, 402),
(14, 403),
(15, 230),
(15, 231),
(15, 503),
(15, 514),
(16, 101),
(17, 311),
(17, 312),
(18, 103),
(18, 114),
(18, 309),
(18, 310),
(19, 201),
(19, 205),
(19, 610),
(19, 611),
(19, 613),
(20, 233),
(20, 502),
(20, 511),
(20, 512),
(20, 515);

-- --------------------------------------------------------

--
-- Table structure for table `product_comparisons`
--

CREATE TABLE `product_comparisons` (
  `id` bigint(20) NOT NULL,
  `comparison_name` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_comparisons`
--

INSERT INTO `product_comparisons` (`id`, `comparison_name`, `created_at`, `user_id`) VALUES
(1, 'So sánh sản phẩm', '2025-11-27 21:17:29.000000', 25);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(1024) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 1,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `variant_id`, `image_url`, `alt_text`, `sort_order`, `is_primary`) VALUES
(1, 1, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000', 'Áo thun nam basic màu trắng', 1, 1),
(2, 1, NULL, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200', 'Chi tiết chất liệu áo thun', 2, 0),
(3, 2, NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'Quần jean nam slim fit xanh đậm', 1, 1),
(4, 2, NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'Chi tiết túi quần jean', 2, 0),
(5, 3, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR640SRWZuL28EiQzJkTqE9nS2W_3xkvs9hbL-P1pv0jW7JATOS8X0CEo72EcDE8Yixvq7pr9cTFmEU6fFB8BXGDNK7rGSzmQ7gNRSsg61z_PGSBZHwogFVxBWHsRjtvxx5V6UMIuRm9Q&usqp=CAc', 'Giày sneaker trắng classic', 1, 1),
(6, 3, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR640SRWZuL28EiQzJkTqE9nS2W_3xkvs9hbL-P1pv0jW7JATOS8X0CEo72EcDE8Yixvq7pr9cTFmEU6fFB8BXGDNK7rGSzmQ7gNRSsg61z_PGSBZHwogFVxBWHsRjtvxx5V6UMIuRm9Q&usqp=CAc', 'Chi tiết đế giày sneaker', 2, 0),
(7, 4, NULL, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/11/bo-the-thao-nam-adidas-3-soc-sereno-cut-mau-xanh-navy-size-l-674818f9cd96d-28112024141713.jpg', 'Hình chính Bộ thể thao nam Adidas', 1, 1),
(8, 4, NULL, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/485/249/products/c6f80a64-e716-48fe-9fea-aa45b16ad3bb.jpg?v=1726208868810', 'Hình hover Bộ thể thao nam Adidas', 2, 0),
(9, 5, NULL, 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936080326575.jpg.webp', 'Hình chính Áo thun nữ basic cổ tròn', 1, 1),
(10, 5, NULL, 'https://cdn.kkfashion.vn/24039-large_default/ao-thun-nu-tay-ngan-co-tron-basic-asm14-28.jpg', 'Hình hover Áo thun nữ basic cổ tròn', 2, 0),
(11, 6, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTghtvPLTQrVJIMLio3SKKZ0QAoF3eDDDg27kaxsEcQdWcMc6oNvudyB4th1uA3Htxzh3_UG7iiDUsbF9y581gZ4c94trxc9qI0Tftlv9EvZ1VdfEbrD9DTzjZ41gl-q6Of4qGOjiM&usqp=CAc', 'Hình chính Áo sơ mi nữ công sở', 1, 1),
(12, 6, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRa9I486wvEEJbmoNhhI-mYuCjkT_cKg8TJI7lSBsHus73exAVy8VdiJMZWzs0fxQ5sm04lc4pByVoV5FtHZAszPkoumkF5S85HP53pS1QU9Sqe6SH9PJSbM6HOdLQ4iuLb7SrMRDs&usqp=CAc', 'Hình hover Áo sơ mi nữ công sở', 2, 0),
(13, 7, NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS1VA01rLoQuebAFLbbOrswAMQelj5GJwALuVssHFr-_QcVfgXUnSI9_FrWP9q0l7QjaNQI4Xl74TE3EN5bkFiverrOQ9SPFJzWwqYyDzhEy8gGpZ-kWzBExxBYy03a6gUxs9SmojHV&usqp=CAc', 'Hình chính Áo cardigan nữ dáng dài', 1, 1),
(14, 7, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTY6xpzIvOTyKppvvnVMwOPqZvdSi8QxP8EmHEYy7JLKFo2CFqar9UMx4HDIk2JRL2DeazA1azKkkDMoV5Zb4l1iquwILZQcffu2emzfEnRh1Sc1vP6twuX1i9a2wcdBU4HsmcqgLII&usqp=CAc', 'Hình hover Áo cardigan nữ dáng dài', 2, 0),
(15, 8, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQSFqVYAq9HBYbTwl96inae7GEj2QvNTDg56qVGwcKae0sdyRLWDRym__2NyWab9HjAEFWNuJVCvJdfAnhdTa5jF3JOJe_AIL4gQBkgR7abYXFKraCC4pXOSnOl3hEqyX1kUGsd8ywyUGQ&usqp=CAc', 'Hình chính Quần jean nữ basic', 1, 1),
(16, 8, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRQ-_ydOTccCLZ3rhsZ4vwr5s0Se77cEu6ztXtwzPC_e3WYBhVvnNivUWjhrL_XqgZcOHEtjI_xKaeOOJZCcISdita6W36PGTYmCqo7lUm83GywJk6wZPDrFQoFKlA5vYpaelTzWOjt&usqp=CAc', 'Hình hover Quần jean nữ basic', 2, 0),
(17, 9, NULL, 'https://www.gento.vn/wp-content/uploads/2023/05/tui-xach-nu-da-bo-1-9.jpg', 'Hình chính Túi xách tay nữ da mềm', 1, 1),
(18, 9, NULL, 'https://www.velisa.vn/wp-content/uploads/2021/03/tui-da-1423.jpg', 'Hình hover Túi xách tay nữ da mềm', 2, 0),
(19, 10, NULL, 'https://lavatino.com/wp-content/uploads/2023/11/WCB01-450x563.jpg', 'Hình chính Ví da nữ cao cấp', 1, 1),
(20, 10, NULL, 'https://lavatino.com/wp-content/uploads/2023/11/wcb04-450x563.jpg', 'Hình hover Ví da nữ cao cấp', 2, 0),
(21, 11, NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPfAm9m5Of2Ibi-wpIvSnb94MqE3BWfkEV-uF2l4KdRwAPIXHJHcloxrrGG-1PZqVC7BxM6fpbbWR1jx4Hf4ra8OvCwTbKUMUlwbRSugiUdecjxLoIekNssW4Aof7cQ610Y3rI5ZVI&usqp=CAc', 'Hình chính Đầm dự tiệc nữ sang trọng', 1, 1),
(22, 11, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRx7rpLLSHeDWZhBk2Kr9rAuHSRcxGw5fKKZbQd3_n4i_0WiODGFmI2uCpW0DdIwZ1KKsx6gZ2314Fsp1_2uq-Dcmipzt-F65DgL4zUl-gmGgZDKloYSiIsO6rr2hvaqRagC2iox50&usqp=CAc', 'Hình hover Đầm dự tiệc nữ sang trọng', 2, 0),
(23, 12, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSGckrxfca-lnZ0MDrsOaWdrk4PBW9W73Kx-ESBmfNyEU_-XmXLgMkqCT-y7JqN_6SN2YGMvOZdpdzUg1Uix3sxDr9rWGOzByZGBsIEnsmMpQRhMWUW8NRrtjY3mRIXXthwhCmU_Txakjo&usqp=CAc', 'Hình chính Đầm suông nữ basic', 1, 1),
(24, 12, NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQwwurQgd_NrPJvMFFfIzwfbjwq21MNfWQ_N-1vZGkzH7QzcFI0P4AYcnaSgMgGTd5xPcFAiyVhfQwFrAYgM9vGcah-sC3P4IN7vUdOWUdGX5Bv_tRZKk5QxA_-U1W2SFIqXwCV51cQ_Bk&usqp=CAc', 'Hình hover Đầm suông nữ basic', 2, 0),
(25, 13, NULL, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/08/giay-sneaker-nu-tommy-hilfiger-women-s-lightz-lace-up-fashion-mau-trang-size-7-5-64d9ab0cc214b-14082023111820.jpg', 'Hình chính Giày sneaker nữ thời trang', 1, 1),
(26, 13, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2LuwxcLsufSdH6V5KJvTmFtH5d4Bj7Afiw&s', 'Hình hover Giày sneaker nữ thời trang', 2, 0),
(27, 14, NULL, 'https://pos.nvncdn.com/be3294-43017/art/20240409_a9KFpMpG.jpeg?v=1712652696', 'Hình chính Giày chạy bộ nam New Balance', 1, 1),
(28, 14, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQq2OU3dPoaPDrrgWfjd9UTXk0uADt2wZ3g&s', 'Hình hover Giày chạy bộ nam New Balance', 2, 0),
(29, 15, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQcKaTFhbpD4NCljz6Hnu5l0duYgtr-eBHSp2uquQSYABKe_cizQZXS2LEVW-4Eol57qaUbp3fh1S5q6qLwiPEPU7APMCkXAJCoBeGLudTfiy5e8zyG0eVu0mI4FkBc8WyO8j3yuCg&usqp=CAc', 'Hình chính Bộ pijama nữ dễ thương', 1, 1),
(30, 15, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTiNHuJ5Xop1tnpCtWe0dzlH-EOTRK8FDxXA4OzjQAOyw3-I9t5ro2nDb64lRUQeGrlRp9ShJl2hjLNgXFU75Lu97kSf2avsAPbjfGN4kPNppsvQwbB7rcPKOzdHn0tV__gHQs0Kvyb&usqp=CAc', 'Hình hover Bộ pijama nữ dễ thương', 2, 0),
(31, 16, NULL, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/06/ao-polo-nam-tommy-hilfiger-man-slim-fit-black-to7447518-mau-den-size-s-667e74ad120da-28062024153037.jpg', 'Hình chính Áo polo nam Tommy Hilfiger', 1, 1),
(32, 16, NULL, 'https://product.hstatic.net/1000008082/product/anh_man_hinh_2025-03-22_luc_01.44.42_4124e1ef42da4a98a13b28939d82bd2a_master.png', 'Hình hover Áo polo nam Tommy Hilfiger', 2, 0),
(33, 17, NULL, 'https://storevietnam.com.vn/wp-content/uploads/That-lung-HERMES-chinh-hang-size-38mm-H075370CP2K-H075387CAAA080-1.png', 'Hình chính Thắt lưng da nam Hermes', 1, 1),
(34, 17, NULL, 'https://storevietnam.com.vn/wp-content/uploads/That-lung-HERMES-chinh-hang-size-38mm-H075370CP2K-H075387CAAA080-1.png', 'Hình hover Thắt lưng da nam Hermes', 2, 0),
(35, 18, NULL, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTg3uB6IE6Z1tcBL4W7l8guZtEWbcsal7lTcJY096rfJZKSHqEW5eb4Yjux5FEpASPoD2sezR5lDgFdtMAtGwQ0EXUQfDG3aOsNGlHN5ld5ja8a7r8SbOtNFknvcE9pHnYPorKCFw&usqp=CAc', 'Hình chính Áo hoodie nam streetwear', 1, 1),
(36, 18, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSIy5Op5jA--tbYsQ_Jk4nWT_FlbdpKY1uo4WmvgmuX9YDibBZsbrRrWYu_mRfXEjGMzPOnna4pDnq7T-6CEcyB1ysWnUrw7trDLhuHMQuk2Cqrw_YpAiWQdsd6BTJKWjXX-fSMEHc&usqp=CAc', 'Hình hover Áo hoodie nam streetwear', 2, 0),
(37, 19, NULL, 'https://bizweb.dktcdn.net/100/287/440/products/ao-thun-local-brand-nu-mau-xam-dep.jpg?v=1629447972113', 'Hình chính Áo thun nữ streetwear', 1, 1),
(38, 19, NULL, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/369/522/products/tee-empty-coral-ao-thun-unisex-nu-phong-cach-streetwear-local-brand-dkmv.png?v=1596902664557', 'Hình hover Áo thun nữ streetwear', 2, 0),
(39, 20, NULL, 'https://ann.com.vn/wp-content/uploads/24150_z5390072024324-616d0efc36cf890ad8bb197cb8c8ecc3_20240427232037.jpg', 'Hình chính Bộ đồ bộ nữ streetwear', 1, 1),
(40, 20, NULL, 'https://ann.com.vn/wp-content/uploads/24150_z5390071820372-0e9aebbf3f100e5673e53c28d0a057f0_20240427232031-282x282.jpg', 'Hình hover Bộ đồ bộ nữ streetwear', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_relations`
--

CREATE TABLE `product_relations` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `related_product_id` bigint(20) NOT NULL,
  `relation_type` varchar(30) NOT NULL COMMENT 'related, upsell, cross-sell, similar',
  `sort_order` int(11) DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `related_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_relations`
--

INSERT INTO `product_relations` (`id`, `product_id`, `related_product_id`, `relation_type`, `sort_order`, `created_at`, `related_id`) VALUES
(1, 1, 2, 'similar', 1, '2025-11-19 08:00:00', NULL),
(2, 1, 3, 'cross-sell', 2, '2025-11-19 08:00:00', NULL),
(3, 2, 1, 'related', 1, '2025-11-19 08:00:00', NULL),
(4, 3, 1, 'upsell', 1, '2025-11-19 08:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `compare_at_price` decimal(38,2) DEFAULT NULL,
  `cost_price` decimal(38,2) DEFAULT NULL,
  `weight_gram` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_default` bit(1) DEFAULT NULL,
  `weight` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `compare_at_price`, `cost_price`, `weight_gram`, `status`, `created_at`, `is_default`, `weight`) VALUES
(1, 1, 'TSHIRT-BLACK-M', 299000.00, 249000.00, 90000.00, 250, 'active', '2025-11-19 08:00:00', NULL, NULL),
(2, 1, 'TSHIRT-WHITE-M', 199000.00, 249000.00, 90000.00, 250, 'active', '2025-11-19 08:00:00', NULL, NULL),
(3, 1, 'TSHIRT-WHITE-L', 199000.00, 249000.00, 90000.00, 260, 'active', '2025-11-19 08:00:00', NULL, NULL),
(4, 2, 'JEAN-NAVY-M', 399000.00, 459000.00, 200000.00, 600, 'active', '2025-11-19 08:00:00', NULL, NULL),
(5, 2, 'JEAN-NAVY-L', 399000.00, 459000.00, 200000.00, 650, 'active', '2025-11-19 08:00:00', NULL, NULL),
(6, 3, 'SNK-WHITE-40', 599000.00, 699000.00, 300000.00, 800, 'active', '2025-11-19 08:00:00', NULL, NULL),
(7, 3, 'SNK-WHITE-41', 599000.00, 699000.00, 300000.00, 820, 'active', '2025-11-19 08:00:00', NULL, NULL),
(8, 3, 'SNK-WHITE-42', 599000.00, 699000.00, 300000.00, 840, 'active', '2025-11-19 08:00:00', NULL, NULL),
(9, 4, 'SKU-P04-DEFAULT', 499000.00, 548900.00, 249500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(10, 5, 'SKU-P05-DEFAULT', 199000.00, 218900.00, 99500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(11, 6, 'SKU-P06-DEFAULT', 299000.00, 328900.00, 149500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(12, 7, 'SKU-P07-DEFAULT', 349000.00, 383900.00, 174500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(13, 8, 'SKU-P08-DEFAULT', 399000.00, 438900.00, 199500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(14, 9, 'SKU-P09-DEFAULT', 599000.00, 658900.00, 299500.00, 500, 'active', '2025-11-19 08:00:00', b'1', 0.5),
(15, 10, 'SKU-P10-DEFAULT', 499000.00, 548900.00, 249500.00, 500, 'active', '2025-11-19 08:00:00', b'1', 0.5),
(16, 11, 'SKU-P11-DEFAULT', 699000.00, 768900.00, 349500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(17, 12, 'SKU-P12-DEFAULT', 459000.00, 504900.00, 229500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(18, 13, 'SKU-P13-DEFAULT', 649000.00, 713900.00, 324500.00, 800, 'active', '2025-11-19 08:00:00', b'1', 0.8),
(19, 14, 'SKU-P14-DEFAULT', 799000.00, 878900.00, 399500.00, 800, 'active', '2025-11-19 08:00:00', b'1', 0.8),
(20, 15, 'SKU-P15-DEFAULT', 359000.00, 394900.00, 179500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(21, 16, 'SKU-P16-DEFAULT', 599000.00, 658900.00, 299500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(22, 17, 'SKU-P17-DEFAULT', 999000.00, 1098900.00, 499500.00, 500, 'active', '2025-11-19 08:00:00', b'1', 0.5),
(23, 18, 'SKU-P18-DEFAULT', 549000.00, 603900.00, 274500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(24, 19, 'SKU-P19-DEFAULT', 249000.00, 273900.00, 124500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(25, 20, 'SKU-P20-DEFAULT', 429000.00, 471900.00, 214500.00, 300, 'active', '2025-11-19 08:00:00', b'1', 0.3),
(26, 4, 'SKU-P04-WHITE-M', 499000.00, 548900.00, 249500.00, 300, 'active', '2025-11-19 08:00:00', NULL, 0.3),
(27, 4, 'SKU-P04-BLACK-L', 499000.00, 548900.00, 249500.00, 320, 'active', '2025-11-19 08:00:00', NULL, 0.32),
(28, 5, 'SKU-P05-WHITE-S', 199000.00, 218900.00, 99500.00, 220, 'active', '2025-11-19 08:00:00', NULL, 0.22),
(29, 5, 'SKU-P05-NAVY-M', 199000.00, 218900.00, 99500.00, 230, 'active', '2025-11-19 08:00:00', NULL, 0.23),
(30, 8, 'SKU-P08-BLACK-S', 399000.00, 438900.00, 199500.00, 500, 'active', '2025-11-19 08:00:00', NULL, 0.5),
(31, 8, 'SKU-P08-WHITE-L', 399000.00, 438900.00, 199500.00, 520, 'active', '2025-11-19 08:00:00', NULL, 0.52),
(32, 16, 'SKU-P16-NAVY-M', 599000.00, 658900.00, 299500.00, 260, 'active', '2025-11-19 08:00:00', NULL, 0.26),
(33, 16, 'SKU-P16-WHITE-L', 599000.00, 658900.00, 299500.00, 270, 'active', '2025-11-19 08:00:00', NULL, 0.27),
(34, 13, 'SKU-P13-WHITE-42', 649000.00, 713900.00, 324500.00, 820, 'active', '2025-11-19 08:00:00', NULL, 0.82),
(35, 14, 'SKU-P14-WHITE-42', 799000.00, 878900.00, 399500.00, 840, 'active', '2025-11-19 08:00:00', NULL, 0.84);

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `score` decimal(6,5) NOT NULL DEFAULT 0.00000,
  `model_version` varchar(50) DEFAULT NULL,
  `generated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recommendations`
--

INSERT INTO `recommendations` (`id`, `user_id`, `product_id`, `score`, `model_version`, `generated_at`) VALUES
(1, 18, 1, 0.95000, 'v1.0', '2025-11-19 09:00:00'),
(2, 18, 3, 0.90000, 'v1.0', '2025-11-19 09:00:00'),
(3, 18, 2, 0.87000, 'v1.0', '2025-11-19 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `revoked_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token_hash`, `ip_address`, `user_agent`, `expires_at`, `created_at`, `revoked_at`) VALUES
(1, 18, '8d19f1f0c1a905b175c0bb3fb8d97dbc6dc105e2161ad67398557b0117aa4708', NULL, NULL, '2025-12-14 14:12:14', '2025-11-14 14:12:14', NULL),
(2, 18, 'c6ad4d7b7e82ca9a370a12f966dfe412ff4aa9f394fb87fa1af6487e2595d14c', NULL, NULL, '2025-12-14 14:12:25', '2025-11-14 14:12:25', NULL),
(3, 18, 'ac31fead97351d500c3794384cdc74d2ef2f8d0bfdb30945ee15edbd433e3b47', NULL, NULL, '2025-12-14 14:12:43', '2025-11-14 14:12:43', NULL),
(4, 18, 'e407c4d4f58a8c221931be8ab0294629ef2e26dcdd8aaa5f60e4816636dbdd80', NULL, NULL, '2025-12-14 14:14:03', '2025-11-14 14:14:03', NULL),
(5, 18, 'de1c6dbad4fbecf095aef3df776c2b2c22329937907447a543ef1cd6e0f027ee', NULL, NULL, '2025-12-14 14:14:54', '2025-11-14 14:14:54', NULL),
(6, 18, '27275b0327dd26e063fa12e399d2b0e25303ab1450d4eb02cc06d0d64af3fb48', NULL, NULL, '2025-12-14 14:14:55', '2025-11-14 14:14:55', NULL),
(7, 18, '917bc706e6360c73d1cea59c3df35da62940840260988cb3783415b064079cc2', NULL, NULL, '2025-12-14 14:15:03', '2025-11-14 14:15:03', NULL),
(8, 18, 'c5490dd4294f02e3f7b6e531d0598ffed1737c1d4aa43ebb33334c0d1864ca6c', NULL, NULL, '2025-12-14 14:15:46', '2025-11-14 14:15:46', NULL),
(9, 18, '0d79239ef306425f38a9823ac953c1ef864d752c83b54a68f801b6f858ecc8db', NULL, NULL, '2025-12-14 14:16:52', '2025-11-14 14:16:52', NULL),
(10, 18, '1322ef50619ef665e796ff98c1830e65dbdc43fe98891e3c3304832bccfdd7fb', NULL, NULL, '2025-12-14 14:16:58', '2025-11-14 14:16:58', NULL),
(11, 18, '3f6b572469d8087c5cc97b28127aab9263827b27a3cfccc41fe994bde72f7ee6', NULL, NULL, '2025-12-14 14:18:14', '2025-11-14 14:18:14', NULL),
(12, 18, 'bfd9934a5fec9056d991150baeca501c12b12d34eec43e6890ef4797ab99e218', NULL, NULL, '2025-12-14 14:18:21', '2025-11-14 14:18:21', NULL),
(13, 18, '118b1c43b8b0fea2199c324f9f22191fbbe390def2e81f56a431a4e9e9787e98', NULL, NULL, '2025-12-14 14:18:25', '2025-11-14 14:18:25', NULL),
(14, 18, '591ac1991f4455e867ec058b8c5108a6e5d46b0c3e91596d76f8ead63cf7c569', NULL, NULL, '2025-12-14 14:18:26', '2025-11-14 14:18:26', NULL),
(15, 18, '71c72bb48fcdf9a971c1028d811d86bf7d7e92e2fabb1d57a52e6348f569e796', NULL, NULL, '2025-12-14 14:19:04', '2025-11-14 14:19:04', NULL),
(16, 18, 'bde042ecdaf8439c03c37bda4eb15db77af07ab5b37b1c08109197f8b0744168', NULL, NULL, '2025-12-14 14:21:01', '2025-11-14 14:21:01', NULL),
(17, 18, '90682f34df977eb207024abc7f44ef4e865d5fcb130bc1c25dc9c7bd8534028d', NULL, NULL, '2025-12-14 14:22:36', '2025-11-14 14:22:36', NULL),
(18, 18, 'faf214bb95cb8c9f6acbe2bf849c8dcd57a8d5c5d04ec1a464c8627e6ff61c2c', NULL, NULL, '2025-12-14 14:22:38', '2025-11-14 14:22:38', NULL),
(19, 18, '802e6ad2e7f5a18b6614a4eab3be03b10adb6f2906666c96be204b8bf4173716', NULL, NULL, '2025-12-14 14:22:39', '2025-11-14 14:22:39', NULL),
(20, 18, '5a0928a944ec3edfdff2d699c0e25509482afa8708f9097caafe50aac56b08e4', NULL, NULL, '2025-12-14 14:22:47', '2025-11-14 14:22:47', NULL),
(21, 18, '2fb798ec321b3b5909a7b983f1e8bd18e50f53495e33ce1e728381cf0980c962', NULL, NULL, '2025-12-14 14:22:48', '2025-11-14 14:22:48', NULL),
(22, 18, 'e2e9b1df013d0d0a9ae2072323d692c174b1c4d0ab22dde033a9d2ba2f168d38', NULL, NULL, '2025-12-14 14:22:50', '2025-11-14 14:22:50', NULL),
(23, 18, 'c2581bbb5927058f86c54cce5a5fd9f94dacc1d225949bfb4d8902671b0bcb6d', NULL, NULL, '2025-12-14 14:22:51', '2025-11-14 14:22:51', NULL),
(24, 18, 'ff0a313ec38534aaeb3ec335681535883f85d57bb67d828e40f9054a0bcb2ca2', NULL, NULL, '2025-12-14 14:22:53', '2025-11-14 14:22:53', NULL),
(25, 18, '3cf15ff0f6153914429bed5f33f2b7a4bb89ff62f11acb8b13d1f49c5b9df13f', NULL, NULL, '2025-12-14 14:22:55', '2025-11-14 14:22:55', NULL),
(26, 18, '663cbb1d4858f3e2a9b9afb36571f003fd869e9a2d82523cbf874ec247f47057', NULL, NULL, '2025-12-14 14:22:56', '2025-11-14 14:22:56', NULL),
(27, 18, '68e6b58e05396a647a008618e50fb9bf19516385c5665fb90dafe2f006ef671d', NULL, NULL, '2025-12-14 14:23:30', '2025-11-14 14:23:30', NULL),
(28, 18, '525a362e54fccff31684a53dfe6786dd5d81f3a2fe3b037f974fffb450cd91a8', NULL, NULL, '2025-12-14 14:23:36', '2025-11-14 14:23:36', NULL),
(29, 18, '04a8728100db354d46aa3b02ab8e1601bdc4259edb46270c5c7835e4df824180', NULL, NULL, '2025-12-14 14:23:38', '2025-11-14 14:23:38', NULL),
(30, 18, 'bce27022ae65e7e371c7346ca60f1fde1c4d6ab5decb8f9f35ab3e4c3f3cdc44', NULL, NULL, '2025-12-14 14:23:39', '2025-11-14 14:23:39', NULL),
(31, 18, 'bc25f4bf1ed493281e37ddb6e43316b3a6bcc46110a5a1fede1a08d0f8f3dbdd', NULL, NULL, '2025-12-14 14:23:40', '2025-11-14 14:23:40', NULL),
(32, 18, 'a95ad708b19dee1118b4a2cd20802b1495b422d9465011a3680146195eae0f05', NULL, NULL, '2025-12-14 14:24:07', '2025-11-14 14:24:07', NULL),
(33, 18, 'a5ba2805eb0734c434bc6afd097eaf2ef8130c7c8a15e100a6518dc46d2fcca4', NULL, NULL, '2025-12-14 14:24:42', '2025-11-14 14:24:42', NULL),
(34, 18, '294fc7f0dde3a9c413e35e7335e51c2a6c15587dec284be016bf73652297f4d9', NULL, NULL, '2025-12-14 14:26:32', '2025-11-14 14:26:32', NULL),
(35, 18, '9fdc29a2a4feaababfe4affe7ff56f66edcb88459d8a869b5f18a6760cbc0903', NULL, NULL, '2025-12-14 14:26:58', '2025-11-14 14:26:58', NULL),
(36, 18, '1aa3d5b44c346bf37c284487a8aa01f3d2f877d04960fd70649996f659477f4c', NULL, NULL, '2025-12-14 14:27:22', '2025-11-14 14:27:22', NULL),
(37, 18, '76a9c563628e2d427984418ee367de31a2e0e213c5ddb1be25aeae25b5dd534e', NULL, NULL, '2025-12-14 14:27:28', '2025-11-14 14:27:28', NULL),
(38, 18, 'f161d0ea33eb99b008015293d03865b9eb0b8bd5ea119394fd511a987bb74e2d', NULL, NULL, '2025-12-14 14:28:00', '2025-11-14 14:28:00', NULL),
(39, 18, '92e77fde61d291f39706a7560941fb14aaea8811c481a0db9b4124f66d1510c1', NULL, NULL, '2025-12-14 14:28:18', '2025-11-14 14:28:18', NULL),
(40, 18, '8ef51264895f6281c16eaf89ec03e789145d7ada9332c4e4d6f97ee9510290ff', NULL, NULL, '2025-12-14 14:29:28', '2025-11-14 14:29:28', NULL),
(41, 18, '60d1837f453d0ff783a91f90ae2faf9c4fb80aa62d5c4087a19639737a7bc9c9', NULL, NULL, '2025-12-14 14:29:49', '2025-11-14 14:29:49', NULL),
(42, 18, '65a697f813a86e9fcb96dc2dd7fc19b41f5548cb384703957c2759c000ad49f1', NULL, NULL, '2025-12-14 14:29:52', '2025-11-14 14:29:52', NULL),
(43, 18, '9912664cf01028f8da8eb6b1a66bcbb28114555acf7862988057e1e9470929a3', NULL, NULL, '2025-12-20 17:48:07', '2025-11-20 17:48:07', NULL),
(44, 18, 'd5aa5819f3dd567b83ea1d711401a10bea47b29602ddfde5c1d2af218a7c5ee0', NULL, NULL, '2025-12-20 17:49:18', '2025-11-20 17:49:18', NULL),
(45, 18, '7336b30572082d7c0b1114dbd61c39a1825bd89c2033168d78676098d443b533', NULL, NULL, '2025-12-20 20:57:00', '2025-11-20 20:57:00', NULL),
(46, 18, 'cc1261340aa59090f8b24a22cc2a047b06511d8e05fd2dab9f8adae460ba7b0a', NULL, NULL, '2025-12-20 20:57:03', '2025-11-20 20:57:03', NULL),
(47, 18, '8b2426c353b9a10db4f38670c23d1d1cfda10acb2fc0c1d2847f41734f3431c4', NULL, NULL, '2025-12-20 21:00:05', '2025-11-20 21:00:05', NULL),
(48, 18, 'c58198d942f115ba648ab12462b2f06ab5dcfe8d9a998f5632719b907275d06d', NULL, NULL, '2025-12-20 21:01:40', '2025-11-20 21:01:40', NULL),
(49, 18, '7888f78eb5992cc778e4f06c570e0907fa31d1e109c1c20640172f6b79be2c2b', NULL, NULL, '2025-12-20 21:01:42', '2025-11-20 21:01:42', NULL),
(50, 18, '1493d50493f487e75fb7ea12569c5bc900ce8fbefc9e8fa5e1ecd81ae3f5c048', NULL, NULL, '2025-12-20 21:02:42', '2025-11-20 21:02:42', NULL),
(51, 18, '548826efbd269ef309310357e0e13fe5659f9e2290e674a6c1bc0d0ee94cdf9f', NULL, NULL, '2025-12-20 21:03:28', '2025-11-20 21:03:28', NULL),
(52, 18, 'b17e7562aac572d4cf7118d971f136a10e289022ed7d5fdc69aa4a64f408be9d', NULL, NULL, '2025-12-20 21:03:50', '2025-11-20 21:03:50', NULL),
(53, 18, '493f7a01cf0e5cca92701e1fda7bce9e53a929d58169553f62403e0e9cb69ec4', NULL, NULL, '2025-12-20 21:04:32', '2025-11-20 21:04:32', NULL),
(54, 18, '93a87c57c0092a31e38939c183d5a748d024a897ef8e667f52fd66d1a04a3055', NULL, NULL, '2025-12-20 21:07:48', '2025-11-20 21:07:48', NULL),
(55, 18, 'a36581da05064d574299f3115385f1fea37d85ca93af7effb7f5dc3e9c6f64d3', NULL, NULL, '2025-12-20 21:11:26', '2025-11-20 21:11:26', NULL),
(56, 18, '484e76bb9d6eb9fd5d6d41b70371b8640773340052f1aa27d01fc7bb864fffaf', NULL, NULL, '2025-12-20 21:12:28', '2025-11-20 21:12:28', NULL),
(57, 18, '705b09bf6206cb1637bc7728e03f684ee46c23f6988e4508453737e19fd59a94', NULL, NULL, '2025-12-20 21:15:30', '2025-11-20 21:15:30', NULL),
(58, 18, '4fd4bf7b38d44c99bcbd387a2bee53489c5b3f48941b413879e2b313e8fdb068', NULL, NULL, '2025-12-20 21:17:42', '2025-11-20 21:17:42', NULL),
(59, 18, 'ae645c08d5e6be29655032640238ace9793d86a0a1a760f2682b67c8acf0547f', NULL, NULL, '2025-12-20 21:18:56', '2025-11-20 21:18:56', NULL),
(60, 18, '8f4133409a8c55c9f0256746091b5bc9d1ccf52f1c95dffdbe5565b3806a2656', NULL, NULL, '2025-12-20 21:24:05', '2025-11-20 21:24:05', NULL),
(61, 18, '9e2b9e6699fbf75bb1d505d7daa6c08689deefe72d5bb46dc51bae7919947057', NULL, NULL, '2025-12-20 21:29:13', '2025-11-20 21:29:13', NULL),
(62, 18, '792cb963f1cf038c0a8daec9a691466098b42651ceb16454cdab5146f76bd741', NULL, NULL, '2025-12-20 21:54:47', '2025-11-20 21:54:47', NULL),
(63, 18, '08872fb2887eef7a297459bba27f24834404a16430efa4e66f129ce72f6ff22b', NULL, NULL, '2025-12-20 22:07:21', '2025-11-20 22:07:21', NULL),
(64, 18, 'd3ff0c9a31c53049516f4c9ff8717a77c7896b597f98ca86cbd541c7469054d3', NULL, NULL, '2025-12-20 23:10:31', '2025-11-20 23:10:31', NULL),
(65, 18, 'e2028930111afd17215337004740913f608d0dae147dab8b935fea925b0a3907', NULL, NULL, '2025-12-20 23:22:20', '2025-11-20 23:22:20', NULL),
(66, 18, '46c1b439bad40a57319dea41912c28bc95fa27f1fa36382addd97b611b15e4b0', NULL, NULL, '2025-12-21 00:31:40', '2025-11-21 00:31:40', NULL),
(67, 18, 'dc7a0e1cb4901f32b4659115f09f15d649e31974a8fd7dfa5a8c81c5fd6d952d', NULL, NULL, '2025-12-21 00:31:42', '2025-11-21 00:31:42', NULL),
(68, 18, 'a5c892f1b8a95d7f00cf57205bde251421e751e95cf1b3ae4db94cbb000a6696', NULL, NULL, '2025-12-21 09:09:08', '2025-11-21 09:09:08', NULL),
(69, 18, '942583380ac5638b179a2fde4bf144af6dc699beda255cfb5126578b5a5e042b', NULL, NULL, '2025-12-21 10:52:08', '2025-11-21 10:52:08', NULL),
(70, 18, '1cd4cc0a4026459ab463258f237d0c50e43b15dcc41e3658adf4565eed61743a', NULL, NULL, '2025-12-21 11:10:56', '2025-11-21 11:10:56', NULL),
(71, 18, 'c8d961c84ee87b4a42493fc08925331d2decfbe4a9ce78e89603c21049c5030f', NULL, NULL, '2025-12-21 11:30:33', '2025-11-21 11:30:33', NULL),
(72, 18, 'd38ac6bc625ab9570d80473248a36bb4ca47930e91db8dd03aec1b1b498a44f2', NULL, NULL, '2025-12-21 12:43:27', '2025-11-21 12:43:27', NULL),
(73, 18, '74a223cf11234e20c8df1917ad2416b23f4697449b0d2299a8832c58c7e187c4', NULL, NULL, '2025-12-21 12:43:29', '2025-11-21 12:43:29', NULL),
(74, 18, '01652885536a0cb3bcd5d9faae88b5329035dce3e3a7b6ff9ae03778144e541f', NULL, NULL, '2025-12-21 13:44:40', '2025-11-21 13:44:40', NULL),
(75, 18, '07d18dbe41ac2cb3b1591cd02beec41e02b0db1bc9e26acbca65bc2e083f7481', NULL, NULL, '2025-12-21 14:58:37', '2025-11-21 14:58:37', NULL),
(76, 18, '366b4b1d08c2c540c5c52fffd4c069e35e2a21a4296bb6fb0ca44c2e1d3ccc87', NULL, NULL, '2025-12-21 15:00:39', '2025-11-21 15:00:39', NULL),
(77, 18, 'a9163231953b74bbd0bfb9e4a2689036c708eff74a90af3f9ac56a3725ba1db4', NULL, NULL, '2025-12-21 15:39:51', '2025-11-21 15:39:51', NULL),
(78, 18, '8c062befb7d995404db5bd791ee919820bb1e266f86d66eb5c8f3a7131b9e60e', NULL, NULL, '2025-12-21 17:35:07', '2025-11-21 17:35:07', NULL),
(79, 18, '023c225b3424a7dd2044ac13c47d7c458dc8d75b322d5378b819e84e6375f44f', NULL, NULL, '2025-12-21 18:38:43', '2025-11-21 18:38:43', NULL),
(80, 18, '3764be74867aaaa5a6b8c23b5b2b6fdaa442af53a3e445f3e5797772825eae10', NULL, NULL, '2025-12-21 20:17:08', '2025-11-21 20:17:08', NULL),
(81, 18, '1d46996123e9b16e9b1b68858e413a59247d102d10a42da729a44433cd2c4389', NULL, NULL, '2025-12-21 21:21:05', '2025-11-21 21:21:05', NULL),
(82, 18, 'abceeeccef2fbf103c6c92b61b71405425ba0025344a23e8151e78b8817fddb7', NULL, NULL, '2025-12-21 21:21:08', '2025-11-21 21:21:08', NULL),
(83, 18, 'ab3fbb93790a527602e79609a274d1596ac6bd77e3b643120d098a218620a040', NULL, NULL, '2025-12-21 22:33:44', '2025-11-21 22:33:44', NULL),
(84, 18, 'fcff01ead5e67ea9e7c54657bcb323b5c5e1ee245b6ce52d58819eef006ef6d6', NULL, NULL, '2025-12-21 22:59:32', '2025-11-21 22:59:32', NULL),
(85, 18, '87eb5f80b4df5ea347baa6c73dd6a182542b2ec3294c40dccb01f22f82acecad', NULL, NULL, '2025-12-22 14:04:32', '2025-11-22 14:04:32', NULL),
(86, 18, '8fb25aa12b6284c822f20c59910f6aaaeb58a6acfcf492e479313d34fcd4261a', NULL, NULL, '2025-12-23 00:46:54', '2025-11-23 00:46:54', NULL),
(87, 18, '19e9d1168d776904feff044bb26f11e14b9eb532e8cdf73bd30981c53ff5e725', NULL, NULL, '2025-12-23 01:48:40', '2025-11-23 01:48:40', NULL),
(88, 18, 'f25752e66e6a734e73fec8cc4f6fe135447eeb9b11e36e4156d514e9b24b27bb', NULL, NULL, '2025-12-23 02:58:23', '2025-11-23 02:58:23', NULL),
(89, 18, '7e39ba7a34be8b4640ab29606a3b23cc3846bcf25ac2a2018dcf6c18eff1224b', NULL, NULL, '2025-12-23 15:21:45', '2025-11-23 15:21:45', NULL),
(90, 18, '2eeebeea0c94bcd2891782a79438555fb79e61f8f7f8423f06ec9d088081629f', NULL, NULL, '2025-12-23 16:22:29', '2025-11-23 16:22:29', NULL),
(91, 18, '42e86b2e2808018c00f1cf4b7012dc70c8a3b6941d48f48891e3d7f0d028cbf6', NULL, NULL, '2025-12-23 17:22:53', '2025-11-23 17:22:53', NULL),
(92, 18, '898e673c6ce1bead32dff245c044c7905a0fe9ea10828be6b339de5ed1be34ab', NULL, NULL, '2025-12-23 18:37:50', '2025-11-23 18:37:50', NULL),
(93, 18, '382fcd40c7a5010810b09a652cf9ba092163ecc76e6eb4628d430df826fe9555', NULL, NULL, '2025-12-23 19:12:28', '2025-11-23 19:12:28', NULL),
(94, 18, '68bfd5ff6f75e23dff3526fc19ccbb2a2ea7e1bf7a83b7d35fc0aaee5114297d', NULL, NULL, '2025-12-24 12:02:16', '2025-11-24 12:02:16', NULL),
(95, 18, 'a90f5bfc60721222d16ac1dcdfddf3f9ab56abbe603fb8f7227f8f8511c3a075', NULL, NULL, '2025-12-24 13:04:06', '2025-11-24 13:04:06', NULL),
(96, 21, '5e370774f72406c90742f9eb821e432672818209f22db4cfad17871a1ebe1d24', NULL, NULL, '2025-12-24 13:07:23', '2025-11-24 13:07:23', NULL),
(97, 18, 'e5799dd7e495d4e222ec64950681b713c0b0a25a0b320bcdddb7c8abeb460be7', NULL, NULL, '2025-12-24 14:23:14', '2025-11-24 14:23:14', NULL),
(98, 18, 'c8aefe8406cb0be7d6d80a19806069b72f0f530f643f0e5009165ff73066bb92', NULL, NULL, '2025-12-24 14:44:49', '2025-11-24 14:44:49', NULL),
(99, 18, '0339ef317d153fc38f8065fb3917c56ac7dc60f2e459bb2acd543b709f3037d6', NULL, NULL, '2025-12-24 14:52:53', '2025-11-24 14:52:53', NULL),
(100, 22, 'c3b42a594eaa25d78399a62657968a7cc40e10e8d87e08a91834711fd99d420f', NULL, NULL, '2025-12-24 14:54:02', '2025-11-24 14:54:02', NULL),
(101, 18, '3f7edb442e9254d39d21ce9c5e46f266ae85c379310e99f45617c391d99d6696', NULL, NULL, '2025-12-24 14:58:04', '2025-11-24 14:58:04', NULL),
(102, 18, 'bf78bdf3d290129c1278b1a6662a2d5669e988724639ad8ac675c5225e8a95ee', NULL, NULL, '2025-12-24 14:58:54', '2025-11-24 14:58:54', NULL),
(103, 18, '443e80885bacadb422f1d8bfb46e259d7e7820c7b2a174eae16b651f7e61e200', NULL, NULL, '2025-12-24 14:59:18', '2025-11-24 14:59:18', NULL),
(104, 18, 'f88751b3762262cceef18da0fbba5ce9bf95768f10686bae186ab804cf9d1d19', NULL, NULL, '2025-12-24 15:07:33', '2025-11-24 15:07:33', NULL),
(105, 22, 'dedd3485e32b3aee468230a12d6e1b48b127f10f8597bfee4b6599367f4751d4', NULL, NULL, '2025-12-24 15:12:04', '2025-11-24 15:12:04', NULL),
(106, 18, 'addb728fd99b2ef4aae117bf07f6f0ede69c59e5469cd9dcb6281c09ae1bb462', NULL, NULL, '2025-12-24 15:12:52', '2025-11-24 15:12:52', NULL),
(107, 18, '433d87203b53d34b44f2c58788d940b03d3a59e1c440d887e20320d96fa7f3b7', NULL, NULL, '2025-12-24 15:18:58', '2025-11-24 15:18:58', NULL),
(108, 22, '253aa4e991d2a2aec6602dbf8580c3233093520ff13635c245a514bf1049ea17', NULL, NULL, '2025-12-24 15:19:17', '2025-11-24 15:19:17', NULL),
(109, 18, '6460ee9df69b5f3da3ac2a6f30d7ee0ac0c3544c7a27b75e20f7b6542717078f', NULL, NULL, '2025-12-24 18:46:59', '2025-11-24 18:46:59', NULL),
(110, 18, 'adf2a51a0c3306aa003068f3fdac18295f1dbfc7f299d9b5fe200891231a49be', NULL, NULL, '2025-12-24 21:17:24', '2025-11-24 21:17:24', NULL),
(111, 22, '42d3a824ed073972352431c2fd1b34d068a58b95a908bcd6e2d61a20ae579a2c', NULL, NULL, '2025-12-24 21:18:07', '2025-11-24 21:18:07', NULL),
(112, 22, '86a9734c9b8c8c1f34bc7258a8463a2b8b56e014a6bf9dd415c04b221beb1778', NULL, NULL, '2025-12-24 21:20:56', '2025-11-24 21:20:56', NULL),
(113, 22, 'eabbb29833effc6a9b8ee2785ad69b70e5fb18cc3db7f42c967f41ba47b9dc1c', NULL, NULL, '2025-12-24 21:24:48', '2025-11-24 21:24:48', NULL),
(114, 22, '69447bdecd6b3d36e2da6b72c791ff9ce5ce1a6dd4e81d2e16346033d1bd1b3c', NULL, NULL, '2025-12-24 21:31:20', '2025-11-24 21:31:20', NULL),
(115, 22, '4b1ac8d89ef302b6f6992964a88f1f2d56ffec942ec345112ecc10ad2a8f0464', NULL, NULL, '2025-12-24 21:42:19', '2025-11-24 21:42:19', NULL),
(116, 18, 'd0f720998dc4494de2f2c7b98363260841cf07f8fb230655827a9480bb8cdf58', NULL, NULL, '2025-12-24 21:53:24', '2025-11-24 21:53:24', NULL),
(117, 18, '050957fc86c5a7aeb24184a4f87d11a12f16c46349b246d03339d413ae6a1a39', NULL, NULL, '2025-12-25 13:48:18', '2025-11-25 13:48:18', NULL),
(118, 18, '7844135e769f27ef5f47b72687e225e679bdec2e4b0d34aef69bf4dcda646efd', NULL, NULL, '2025-12-25 13:49:10', '2025-11-25 13:49:10', NULL),
(119, 18, '0d4edc8437df6cb76d2ef9a9f0a7063d3a5ea5d87b6abe9d76557bfd3b604a97', NULL, NULL, '2025-12-25 13:51:38', '2025-11-25 13:51:38', NULL),
(120, 22, '4da8eee5990e9e4e232d73665f0333e911cd32a317bad9132a15dae019675004', NULL, NULL, '2025-12-25 13:58:12', '2025-11-25 13:58:12', NULL),
(121, 18, '28ec7a70488154ea515d9c36a70f633934825dc26788bb69b97d4e2022eac87f', NULL, NULL, '2025-12-25 14:00:11', '2025-11-25 14:00:11', NULL),
(122, 18, '93f6327c20c5665cfaacf5176564098900da085dbababb9e13a73ec07c5239cb', NULL, NULL, '2025-12-25 14:02:21', '2025-11-25 14:02:21', NULL),
(123, 18, 'c913cfd8da97b338b7c7700d750dec52c5a02ad2a973c28e9b7539ae478cd6fc', NULL, NULL, '2025-12-25 14:05:11', '2025-11-25 14:05:11', NULL),
(124, 18, '47aff12d6ff1ddce88b32671d15315a18fb9e31dd993afd8df95e275a8508b3e', NULL, NULL, '2025-12-25 16:11:05', '2025-11-25 16:11:05', NULL),
(125, 22, '47c20ebadb3a861feaaac599522b81b717c7bba12270d6989d5af391473e811b', NULL, NULL, '2025-12-25 16:12:00', '2025-11-25 16:12:00', NULL),
(126, 18, '3522ca9a462ad2167dd192756a8870cb4adbe1d7a3372f2600ee91ea5dd511d4', NULL, NULL, '2025-12-25 16:17:45', '2025-11-25 16:17:45', NULL),
(127, 18, '979ccd52b4740f1628cf9e5b0ed5f4d537aa0776ea38f4c3534e33635c64d768', NULL, NULL, '2025-12-25 16:19:14', '2025-11-25 16:19:14', NULL),
(128, 18, '9867815ef1e294d2f8caf06c15543f217d38bcd1923dda23cfc43d1de64594df', NULL, NULL, '2025-12-25 16:21:14', '2025-11-25 16:21:14', NULL),
(129, 22, '8b0ea9b189255c03fe5a5c98fb4d0a6e8d1f93c29ce7985e115f2abab0d03f33', NULL, NULL, '2025-12-25 16:21:30', '2025-11-25 16:21:30', NULL),
(130, 18, '2710f6f4c4c73e646c377504c0b6f7135096e51a6c7ad40dccccf34e64967ef7', NULL, NULL, '2025-12-25 16:30:42', '2025-11-25 16:30:42', NULL),
(131, 18, '6d503f2ed2da5be68a56ed5333a53c442acc680108f4f8f8f8150ee14bd1d869', NULL, NULL, '2025-12-25 16:35:14', '2025-11-25 16:35:14', NULL),
(132, 18, 'd14f70382aaa10f4e750d09f92e5689f0031951faa893d91a596a996200042b6', NULL, NULL, '2025-12-25 16:41:56', '2025-11-25 16:41:56', NULL),
(133, 18, 'a0b5bd6d734b7688d896c3d2a459faba6944d741e50a99d4dde07841f738926d', NULL, NULL, '2025-12-25 17:49:58', '2025-11-25 17:49:58', NULL),
(134, 22, '610c95fa0ea28b681f44e0b532e9093f28ed5520433ede341d54df22a3c5fea5', NULL, NULL, '2025-12-25 17:51:07', '2025-11-25 17:51:07', NULL),
(135, 18, 'ecbac8a79737077b30ea6202681becef95c3811d60426697643fa13d1a6cc382', NULL, NULL, '2025-12-25 17:59:34', '2025-11-25 17:59:34', NULL),
(136, 18, '32685583130a2e4890fefb7bef1601e486ed37752ca3b5cf23f0aace1fe0b761', NULL, NULL, '2025-12-25 18:18:38', '2025-11-25 18:18:38', NULL),
(137, 22, 'c88995d2def2a356aaee466ae77193d16e383a9ab8dfdb0278a4ed1f55e09f47', NULL, NULL, '2025-12-25 18:24:38', '2025-11-25 18:24:38', NULL),
(138, 18, '91d4737cdc94795e88cd52146fc5d72fa290abb6d125ddb16e42eea13c07c636', NULL, NULL, '2025-12-25 18:26:04', '2025-11-25 18:26:04', NULL),
(139, 22, 'f2f67962c6cb1132432a64f5fd5c1c198d395ca0796ec8c16bab33d13bf1eb78', NULL, NULL, '2025-12-25 18:33:06', '2025-11-25 18:33:06', NULL),
(140, 18, '3c104bf2427704a6a7aace2a9c7139f3166cdccdfbc82bb2e5e10e8cc3faa1b7', NULL, NULL, '2025-12-25 18:38:15', '2025-11-25 18:38:15', NULL),
(141, 18, '8c263fc4c95bb8fdbbff0e040a8824530f901e4cc08e1e8a0d66639a049c7041', NULL, NULL, '2025-12-25 18:50:19', '2025-11-25 18:50:19', NULL),
(142, 18, '615033cf27f79bfdb7f3418b4da041c26b1f04fa668c60bf5659a28ea1a46eef', NULL, NULL, '2025-12-25 20:23:45', '2025-11-25 20:23:45', NULL),
(143, 18, 'a0b71a95a1c5b6226f7f293687025c481a3f8d945854dde57b8cefee7cbcac35', NULL, NULL, '2025-12-25 20:42:22', '2025-11-25 20:42:22', NULL),
(144, 22, '7867be122ed510bb962a125101cf4837303bb3a4ef0548623874ef28f96b9fcd', NULL, NULL, '2025-12-25 20:53:37', '2025-11-25 20:53:37', NULL),
(145, 23, '7cc12e7b3507dcee6cd02f80b21222d4c1effe52054369b5d319c7095c1bdba2', NULL, NULL, '2025-12-25 21:00:46', '2025-11-25 21:00:46', NULL),
(146, 22, '7104b0116ea26d0d2c4af994702f0eda58c821964afdbb22bdbe4fcb07284abf', NULL, NULL, '2025-12-25 23:23:26', '2025-11-25 23:23:26', NULL),
(147, 23, 'a97185eeda3763f1da85037f7db17f065dd601553f373f7d5e8ed255e9c6d8da', NULL, NULL, '2025-12-25 23:25:28', '2025-11-25 23:25:28', NULL),
(148, 18, '70a7ab0356e440e1de268ef6e039280088e7aa29203cca4d772fe7533d5dc2df', NULL, NULL, '2025-12-25 23:27:02', '2025-11-25 23:27:02', NULL),
(149, 23, '908e9b0f315ad3136e32b19c43d545ab746d5df137f9c7db6feaaf8c66eaca4c', NULL, NULL, '2025-12-25 23:27:55', '2025-11-25 23:27:55', NULL),
(150, 18, '5aa44507122c5dd86c735d0d8ed9f86cee408c22031ca6e40a0e3abc40d776fb', NULL, NULL, '2025-12-25 23:28:53', '2025-11-25 23:28:53', NULL),
(151, 18, '7f30d939d0ca998a0fd0e50db2e36972e05a1f29949bfbb95d2ac3b0a074bcb0', NULL, NULL, '2025-12-26 00:31:02', '2025-11-26 00:31:02', NULL),
(152, 23, '1c5dc507cf4ad77ff03795c5e86f01714f3ce236bfe09690426fc2a595298a2b', NULL, NULL, '2025-12-26 00:32:11', '2025-11-26 00:32:11', NULL),
(153, 22, '0f5da18afd23fc2255d672ad19fce70939217cf69e5f85e88559698e48308dc7', NULL, NULL, '2025-12-26 00:35:41', '2025-11-26 00:35:41', NULL),
(154, 23, 'e3e814593343eead5255d6bc61182175a45f64b5b7bc0220061669c71df176c4', NULL, NULL, '2025-12-26 00:39:17', '2025-11-26 00:39:17', NULL),
(155, 23, '54eaea484d733071d91600d9aed07af9fe8979ae579065c3903e3f7cfae8cc22', NULL, NULL, '2025-12-26 12:08:39', '2025-11-26 12:08:39', NULL),
(156, 22, '0141b337ae8a6e0aaac0dd6aea3748e1d681957081aae6930d98fea140590ff3', NULL, NULL, '2025-12-26 12:16:50', '2025-11-26 12:16:50', NULL),
(157, 24, '981aca8016163b01f9088d840b883e61bf043d591ae18ebbf682e49679cfac17', NULL, NULL, '2025-12-26 12:20:08', '2025-11-26 12:20:08', NULL),
(158, 18, 'fde08d76e92a0c3c51a3220bd4ec409c2ac07cdeeb48cf7d207ccfb03d2009d9', NULL, NULL, '2025-12-26 12:33:44', '2025-11-26 12:33:44', NULL),
(159, 18, '2c6a88cb11ee6ed6963024df64f4138622097ee5077c71de9d023a666e94aa43', NULL, NULL, '2025-12-26 14:49:49', '2025-11-26 14:49:49', NULL),
(160, 18, '50b7e810976b5183c9af95d7544f363b49302ae1a1dc6ed2a39be628cb69d339', NULL, NULL, '2025-12-26 15:29:06', '2025-11-26 15:29:06', NULL),
(161, 23, 'de2ddd678dcc23f624c737e5a222e588bdfb9d9213dd414fd5261b1ce06990c8', NULL, NULL, '2025-12-26 15:44:20', '2025-11-26 15:44:20', NULL),
(162, 18, '2c7b71aae992753109f02ddd5adf7597e3d6d7ec7cc162b9d70b42e50a944ff0', NULL, NULL, '2025-12-26 19:49:22', '2025-11-26 19:49:22', NULL),
(163, 23, '7b245d69f05ce945917b63ae865fc5ea025162be6962ab57a647b3bc01189d72', NULL, NULL, '2025-12-26 23:25:32', '2025-11-26 23:25:32', NULL),
(164, 18, '3380c741ed567d8cad6d2ec84b0b6e6939c73100ab487f4fb530c043423912e3', NULL, NULL, '2025-12-26 23:25:44', '2025-11-26 23:25:44', NULL),
(165, 23, 'a1fb337a857da8ee5fd5382a1ec546278610020f6f685703c66745231715f0dd', NULL, NULL, '2025-12-26 23:44:53', '2025-11-26 23:44:53', NULL),
(166, 23, '001e9fcf4694dc0b564a51421c2a55bbcfdf1d4022b747437580f263b3349358', NULL, NULL, '2025-12-27 13:48:22', '2025-11-27 13:48:22', NULL),
(167, 18, '60804257c6d5db1dd95f3e423cb1092679315d2c6ba45c37eb90d91497c378a8', NULL, NULL, '2025-12-27 13:49:27', '2025-11-27 13:49:27', NULL),
(168, 25, '447251812979c52c5ade0755833c8e304e8da99d891671f84f3680e9f39c2cdf', NULL, NULL, '2025-12-27 16:03:08', '2025-11-27 16:03:08', NULL),
(169, 26, 'd6d2e27b4f2a8c7014d08f4255837335e3873c240bfff8a559801c72f9cd5201', NULL, NULL, '2025-12-27 16:04:40', '2025-11-27 16:04:40', NULL),
(170, 25, 'ca4a3970376b8020c3c6ed5713756c964f4a01fb94dd0827500eaac3e03af87b', NULL, NULL, '2025-12-27 16:05:44', '2025-11-27 16:05:44', NULL),
(171, 25, 'f1f43d06208fa685262a2d00a8e0a5f62bf7d854f51b52203fb427cc46176c63', NULL, NULL, '2025-12-27 16:52:44', '2025-11-27 16:52:44', NULL),
(172, 25, '52efd1ae323729c40b1560176d945c29b7d137bcaab610afdc1181085081c991', NULL, NULL, '2025-12-27 18:29:28', '2025-11-27 18:29:28', NULL),
(173, 25, '2f821b156f48249216697bedfda3bf17bbb53714ec7464e632228ea0949f197e', NULL, NULL, '2025-12-27 19:52:02', '2025-11-27 19:52:02', NULL),
(174, 25, '45e7997932c1a79addb91225f8e534c69d6b5f593d0a989ffc5af82e6f8f80af', NULL, NULL, '2025-12-27 20:02:34', '2025-11-27 20:02:34', NULL),
(175, 25, '4ee5e766f8f1d535d9ad07a270aa470f5ef986d35e56c749735b8d3e7ea0c4a1', NULL, NULL, '2025-12-27 20:03:08', '2025-11-27 20:03:08', NULL),
(176, 25, '0a7886d6caa9ce45a7fce8dd81e94aca5d3ae0cd738106479cddedd7843cbf9c', NULL, NULL, '2025-12-27 20:26:47', '2025-11-27 20:26:47', NULL),
(177, 25, '850c6ff16e2338a46b566732244fe8fc715d9becf715e27cad34279aedc7a4a3', NULL, NULL, '2025-12-27 20:43:32', '2025-11-27 20:43:32', NULL),
(178, 25, '98ef9562b876b5a56d6118d6bb7dfea36bae229ac4b627e73b87261ae713e99d', NULL, NULL, '2025-12-27 21:02:31', '2025-11-27 21:02:31', NULL),
(179, 25, '2488c7fe56fdaff2f6f1988bff1d2adde5d177dd8eab077546deea3fd682da92', NULL, NULL, '2025-12-27 21:03:13', '2025-11-27 21:03:13', NULL),
(180, 25, '62c0336bbf1b1e0488542c51dba65101c09d398556cbe797aa2a7d7f3fa59af6', NULL, NULL, '2025-12-27 21:06:31', '2025-11-27 21:06:31', NULL),
(181, 25, 'a1a8083c9b6f29bc32f0b3702fab5e15ec5e8197f1e7bad62fc09aa88e48ffb3', NULL, NULL, '2025-12-27 21:06:53', '2025-11-27 21:06:53', NULL),
(182, 25, 'd4bbf3d27542e72fc026d3401c9d379f7ba1f60dfa616c54fc14d8617717ea0f', NULL, NULL, '2025-12-27 22:11:47', '2025-11-27 22:11:47', NULL),
(183, 25, '71c85be3be5f47cbcf079773b9a3f804d8f37e216d6d971d05630d9f6abd0240', NULL, NULL, '2025-12-28 00:54:54', '2025-11-28 00:54:54', NULL),
(184, 18, '671976d17661ccb0045c8612d03c4e929abd152194933f5b8f456ca1b286c770', NULL, NULL, '2025-12-28 01:19:12', '2025-11-28 01:19:12', NULL),
(185, 18, 'fc23e5a3fc76f40d49870c164a831d90bbb689b25e9ee5f33b82b07329263c94', NULL, NULL, '2025-12-28 02:20:22', '2025-11-28 02:20:22', NULL),
(186, 25, 'cb75c425ab4785f52cff24515b2e9504fa0e2dbd06bd1b38a8bd12b56152ed13', NULL, NULL, '2025-12-28 14:27:34', '2025-11-28 14:27:34', NULL),
(187, 18, '6b92700e2620f45194c6f4ba2c6b83c2726bf06a15760dde5a5db89ee066bf7f', NULL, NULL, '2025-12-28 15:37:44', '2025-11-28 15:37:44', NULL),
(188, 18, 'fd5cf7db44f6dccf11fb72f7c41a08e8bf413da9cb5ab5781e3d4a231fd3975b', NULL, NULL, '2025-12-28 16:44:39', '2025-11-28 16:44:39', NULL),
(189, 18, 'be738f9e9ea483bb84bf14f705dfc377f1551a2cf50e7b04b7f2dc39d4f87458', NULL, NULL, '2025-12-28 17:45:24', '2025-11-28 17:45:24', NULL),
(190, 18, 'e5a65fec305305f3c6723b4a09e4aaa1106ff133a3cbfbe465838261db295654', NULL, NULL, '2025-12-29 09:37:57', '2025-11-29 09:37:57', NULL),
(191, 18, '2b4bbd953d940af47678eb1adb805f773b64b1d255301f67e9f99038cbdbedda', NULL, NULL, '2025-12-29 18:00:55', '2025-11-29 18:00:55', NULL),
(192, 18, 'd9189c8c65555096a000b2bdd89caf1d800a9baa5c2f48a9830d609b89d979a6', NULL, NULL, '2025-12-30 02:38:42', '2025-11-30 02:38:42', NULL),
(193, 18, 'ae36632d86d2e8e86091e7a4577be65d6828aab8b0e8ebd594049e4de5a21697', NULL, NULL, '2025-12-30 02:42:02', '2025-11-30 02:42:02', NULL),
(194, 106, '7130bb96580bd864d6a0d58ce7923b588996b972eb545f9b45b4d53232952170', NULL, NULL, '2025-12-30 02:43:27', '2025-11-30 02:43:27', NULL),
(195, 18, '1a8c3b8b384b8df08a32d2fbe466a341ed7fed5e939d8013cd5ba767171916d0', NULL, NULL, '2025-12-30 02:43:47', '2025-11-30 02:43:47', NULL),
(196, 106, 'f639e1f459b214987bd27c5ae38faaaf2c47be9d7d41ba047e23a8eeeee8a471', NULL, NULL, '2025-12-30 02:44:26', '2025-11-30 02:44:26', NULL),
(197, 18, '6aa771bc16c7ddc0a857dceecfb5e1f2ce75665226d5732cd621059b4a6451c5', NULL, NULL, '2025-12-30 02:44:45', '2025-11-30 02:44:45', NULL),
(198, 108, '6eb3d689ac1f115f7907ed5365dddca8c88d014e4be1a22df3318ce2d4825cd5', NULL, NULL, '2025-12-30 02:47:04', '2025-11-30 02:47:04', NULL),
(199, 18, '15dba201a5f484b61a358902c89d441d4fecd08f201e2766912eb40ac537f714', NULL, NULL, '2025-12-30 04:11:38', '2025-11-30 04:11:38', NULL),
(200, 23, 'e193cef3f2721526351f1159892442fabcb5cecaa8fccc5e9188513f700c2d1e', NULL, NULL, '2025-12-30 04:30:37', '2025-11-30 04:30:37', NULL),
(201, 23, 'e629671fae5980ff7b2015d5fd51dcb1eccb64d0ae4911c9bf274d4ed95f5052', NULL, NULL, '2025-12-30 04:41:58', '2025-11-30 04:41:58', NULL),
(202, 23, '17992efc4a98d6a1d45ba30572b690a10afb85dd2ad59b944b877b5c077fc4eb', NULL, NULL, '2026-01-01 00:17:46', '2025-12-02 00:17:46', NULL),
(203, 23, 'fbc85adafbb422a2ea866198e1ad5e971cc45c581009bd84b1e50c92ff110d27', NULL, NULL, '2026-01-01 01:00:34', '2025-12-02 01:00:34', NULL),
(204, 23, '5bde47e88bfc0d347fa5d1b99c658309a701a592b32a3cbbe709d8d918afdf35', NULL, NULL, '2026-01-01 02:01:42', '2025-12-02 02:01:42', NULL),
(205, 18, '08884e7e08d0fc5343093cfc0536e38896af1daa7cc52fb2fd2cba4b450a18c6', NULL, NULL, '2026-01-05 14:27:58', '2025-12-06 14:27:58', NULL),
(206, 23, '9211b85740c504b18ca25ad005b9a4c15462c266343f3521bf25094a2873e2a9', NULL, NULL, '2026-01-05 14:28:31', '2025-12-06 14:28:31', NULL),
(207, 18, 'aa4387c77e3afef0f746d032264326227487a60b0ae356ac7ff6641af1987dba', NULL, NULL, '2026-01-05 15:59:40', '2025-12-06 15:59:40', NULL),
(208, 18, '4b9d4d772a7028fdc78cf83ccb257b866af23a3a619de5070d6ff60dc0f561de', NULL, NULL, '2026-01-05 17:49:02', '2025-12-06 17:49:02', NULL),
(209, 23, '1dfd1c69c4c3f09e0c55aeeb37af8d7821409b2c5380480ae5647faa074aabd8', NULL, NULL, '2026-01-05 17:49:25', '2025-12-06 17:49:25', NULL),
(210, 23, '5ef6c6849440b1596f236e576f1e4a38dc59bb3f89935e922ccc8e04e3371322', NULL, NULL, '2026-03-06 19:17:50', '2025-12-06 19:17:50', NULL),
(211, 18, 'acf2e992e3964d045ee9164be58194d13c1ba9a9b1c176d67cc02ab409e267f2', NULL, NULL, '2026-03-06 19:32:13', '2025-12-06 19:32:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `amount` decimal(38,2) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `account_holder` varchar(255) DEFAULT NULL,
  `refund_code` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `sepay_transaction_id` varchar(255) DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refunds`
--

INSERT INTO `refunds` (`id`, `order_id`, `payment_id`, `user_id`, `amount`, `bank_name`, `account_number`, `account_holder`, `refund_code`, `status`, `reason`, `sepay_transaction_id`, `transaction_date`, `created_at`, `updated_at`) VALUES
(1, 20, 16, 18, 209000.00, 'MB', '1027759826', 'LE VAN A', 'REF-ORD1763833630439', 'REQUESTED', 'Tôi đổi ý', NULL, NULL, '2025-11-23 00:50:42', '2025-11-23 03:07:29'),
(3, 22, 18, 18, 219000.00, 'MB', '1027759826', 'LE VAN A', 'REFORD1763835054049', 'DONE', 'Tôi đổi ý', '31900063', '2025-11-23 01:26:00', '2025-11-23 01:11:20', '2025-11-23 01:22:33'),
(4, 24, 20, 18, 209000.00, 'MB', '1027759826', 'LE VAN A', 'REFORD1763837330907', 'DONE', 'Tôi đổi ý', '31901387', '2025-11-23 01:58:00', '2025-11-23 01:49:59', '2025-11-23 01:53:02'),
(5, 25, 21, 18, 209000.00, 'MB', '1027759826', 'LE VAN A', 'REF-ORD1763838063378', 'DONE', 'Tôi đổi ý', '31901509', '2025-11-23 02:02:00', '2025-11-23 02:01:56', '2025-11-23 02:03:04'),
(6, 17, 13, 18, 209000.00, 'Vietcombank', '1027759826', 'Mai Anh Khoi', 'REF-ORD1763737909904', 'REQUESTED', 'Tôi đổi ý', NULL, NULL, '2025-11-23 03:05:31', NULL),
(7, 28, 28, 18, 209000.00, 'Vietcombank', '1024719635', 'Bui Thi Diem My', 'REFORD1763886750849', 'DONE', 'Tôi đổi ý', '31975288', '2025-11-23 15:35:00', '2025-11-23 15:33:53', '2025-11-23 15:35:51'),
(8, 43, 60, 18, 209000.00, 'BIDV', '5811598309', 'Nguyen Ngoc Huy', 'REFORD1763893318685', 'DONE', 'Tôi đổi ý', '31994757', '2025-11-23 17:32:00', '2025-11-23 17:25:54', '2025-11-23 17:32:24'),
(9, 46, 62, 23, 379000.00, 'Vietcombank', '1027759826', 'Mai Anh Khoi', 'REFORD1764174405202', 'DONE', 'Tôi đổi ý', '32589918', '2025-11-26 23:32:00', '2025-11-26 23:30:57', '2025-11-26 23:32:46');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `order_item_id` bigint(20) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `content_text` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `order_item_id`, `rating`, `content_text`, `status`, `created_at`) VALUES
(1, 1, 18, 1, 5, 'Áo thun mặc rất mát, form vừa vặn, chất liệu mềm.', 'approved', '2025-11-19 08:40:00'),
(2, 3, 18, 3, 4, 'Giày đẹp, dễ phối đồ, đi hơi cứng trong ngày đầu nhưng ổn.', 'approved', '2025-11-19 08:42:00'),
(3, 1, 25, NULL, 5, 'QUÁ CHẤT LƯỢNG ĐI NÀO', 'approved', '2025-11-27 22:16:21');

-- --------------------------------------------------------

--
-- Table structure for table `review_media`
--

CREATE TABLE `review_media` (
  `review_id` bigint(20) NOT NULL,
  `media_id` bigint(20) NOT NULL,
  `sort_order` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review_media`
--

INSERT INTO `review_media` (`review_id`, `media_id`, `sort_order`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 8, 0);

-- --------------------------------------------------------

--
-- Table structure for table `review_summaries`
--

CREATE TABLE `review_summaries` (
  `product_id` bigint(20) NOT NULL,
  `summary_text` text DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review_summaries`
--

INSERT INTO `review_summaries` (`product_id`, `summary_text`, `updated_at`) VALUES
(1, 'Áo thun được đánh giá cao về độ thoáng mát và form dáng, phù hợp mặc hằng ngày.', '2025-11-19 08:45:00'),
(2, 'Quần jean co giãn tốt, dễ phối đồ, phù hợp đi làm và đi chơi.', '2025-11-19 08:45:00'),
(3, 'Giày sneaker trắng basic, dễ phối với nhiều kiểu trang phục, chất lượng ổn trong tầm giá.', '2025-11-19 08:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `code` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `code`, `name`) VALUES
(1, 'ADMIN', 'Administrator'),
(2, 'PRODUCT_MANAGER', 'Product Manager'),
(3, 'ORDER_MANAGER', 'Order Manager'),
(4, 'CUSTOMER_SERVICE', 'Customer Service'),
(5, 'MARKETING_STAFF', 'Marketing Staff'),
(6, 'ACCOUNTANT', 'Accountant'),
(7, 'USER', 'Customer');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` bigint(20) NOT NULL,
  `permission_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);

-- --------------------------------------------------------

--
-- Table structure for table `shop_settings`
--

CREATE TABLE `shop_settings` (
  `id` tinyint(4) NOT NULL DEFAULT 1,
  `shop_name` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `contact_address` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_opening_hours` varchar(255) DEFAULT '8:00 - 19:00, Thứ 2 - Thứ 7',
  `contact_map_iframe` text DEFAULT NULL COMMENT 'Google Maps iframe src',
  `social_facebook_url` varchar(255) DEFAULT NULL,
  `social_instagram_url` varchar(255) DEFAULT NULL,
  `social_x_url` varchar(255) DEFAULT NULL,
  `social_snapchat_url` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `tax_percent` decimal(38,2) DEFAULT NULL,
  `email_from` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop_settings`
--

INSERT INTO `shop_settings` (`id`, `shop_name`, `logo_url`, `contact_address`, `contact_phone`, `contact_email`, `contact_opening_hours`, `contact_map_iframe`, `social_facebook_url`, `social_instagram_url`, `social_x_url`, `social_snapchat_url`, `currency`, `timezone`, `tax_percent`, `email_from`, `created_at`, `updated_at`) VALUES
(1, 'UTE - Đại học Sư phạm Kỹ thuật', '/images/logo/logo.svg', '01 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh', '0332777154', 'maianhkhoi04@gmail.com', '8:00 - 19:00, Thứ 2 - Thứ 7', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.485467675198!2d106.76933817480604!3d10.850632389302683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1763633916655!5m2!1svi!2s', 'https://www.facebook.com/dhspkt.hcmute/?locale=vi_VN', 'https://www.instagram.com/uteshop', 'https://x.com/uteshop', 'https://www.snapchat.com/add/uteshop', 'VND', 'Asia/Ho_Chi_Minh', 10.00, 'noreply@uteshop.vn', '2025-11-20 16:58:17', '2025-11-20 17:20:43');

-- --------------------------------------------------------

--
-- Table structure for table `social_accounts`
--

CREATE TABLE `social_accounts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `provider` varchar(50) NOT NULL COMMENT 'google, facebook, apple, zalo',
  `provider_user_id` varchar(191) NOT NULL COMMENT 'ID từ provider',
  `provider_email` varchar(191) DEFAULT NULL,
  `provider_name` varchar(255) DEFAULT NULL,
  `provider_avatar` varchar(512) DEFAULT NULL,
  `access_token` text DEFAULT NULL COMMENT 'Token từ provider (nên encrypt)',
  `refresh_token` text DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  `profile_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profile_data`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `safety_stock` int(11) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `location` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `variant_id`, `quantity`, `safety_stock`, `updated_at`, `location`) VALUES
(1, 1, 50, 5, '2025-11-19 08:00:00', NULL),
(2, 2, 36, 5, '2025-11-23 17:32:24', NULL),
(3, 3, 30, 3, '2025-11-19 08:00:00', NULL),
(4, 4, 24, 3, '2025-11-26 23:32:46', NULL),
(5, 5, 20, 2, '2025-11-19 08:00:00', NULL),
(6, 6, 15, 2, '2025-11-19 08:00:00', NULL),
(7, 7, 10, 2, '2025-11-19 08:00:00', NULL),
(8, 8, 8, 1, '2025-11-19 08:00:00', NULL),
(9, 9, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(10, 10, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(11, 11, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(12, 12, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(13, 13, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(14, 14, 20, 2, '2025-11-19 08:00:00', 'MAIN'),
(15, 15, 20, 2, '2025-11-19 08:00:00', 'MAIN'),
(16, 16, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(17, 17, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(18, 18, 15, 2, '2025-11-19 08:00:00', 'MAIN'),
(19, 19, 15, 2, '2025-11-19 08:00:00', 'MAIN'),
(20, 20, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(21, 21, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(22, 22, 20, 2, '2025-11-19 08:00:00', 'MAIN'),
(23, 23, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(24, 24, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(25, 25, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(26, 26, 25, 3, '2025-11-19 08:00:00', 'MAIN'),
(27, 27, 20, 3, '2025-11-19 08:00:00', 'MAIN'),
(28, 28, 30, 3, '2025-11-19 08:00:00', 'MAIN'),
(29, 29, 18, 2, '2025-11-19 08:00:00', 'MAIN'),
(30, 30, 15, 2, '2025-11-19 08:00:00', 'MAIN'),
(31, 31, 12, 2, '2025-11-19 08:00:00', 'MAIN'),
(32, 32, 20, 3, '2025-11-19 08:00:00', 'MAIN'),
(33, 33, 15, 2, '2025-11-19 08:00:00', 'MAIN'),
(34, 34, 10, 2, '2025-11-19 08:00:00', 'MAIN'),
(35, 35, 8, 2, '2025-11-19 08:00:00', 'MAIN');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(120) NOT NULL,
  `username` varchar(80) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL COMMENT 'male, female, other',
  `date_of_birth` date DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `avatar_url` varchar(512) DEFAULT NULL,
  `preferences_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences_json`)),
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `phone`, `phone_verified_at`, `gender`, `date_of_birth`, `password_hash`, `two_factor_enabled`, `two_factor_secret`, `failed_login_attempts`, `locked_until`, `avatar_url`, `preferences_json`, `status`, `last_login_at`, `created_at`, `updated_at`) VALUES
(18, 'Khôi Mai Anh', NULL, 'maianhkhoi04@gmail.com', '2025-11-14 13:54:19', '0332777154', NULL, NULL, NULL, '$2a$10$JGjUVv6s9blvgvKNOrkl9OYDMaQawKOcJUq2EoWZ87Olj2zkOdohS', 0, NULL, 3, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJKqGeNYifs2ordhkXbymrL0D_EvsiMq_HZOfswWGjt0RolVUohIOvlsEwO9AV0hzKTz0&usqp=CAU', NULL, 'ACTIVE', '2025-12-06 19:32:13', '2025-11-14 13:54:05', '2025-12-06 23:14:36'),
(21, 'Khôi Mai An', NULL, '22110356@student.hcmute.edu.vn', NULL, '0332777154', NULL, NULL, NULL, 'https://i.pinimg.com/736x/fd/be/42/fdbe42afc46d6309bd6e33cc07db20e5.jpg', 0, NULL, 0, NULL, 'https://demoda.vn/wp-content/uploads/2022/01/anh-dai-dien-nguoi-giau-mat.jpg', NULL, 'ACTIVE', '2025-11-24 13:07:23', '2025-11-24 13:07:10', '2025-11-27 20:23:41'),
(22, 'Khôi Mai Anh', NULL, 'maianhkhoi@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$JGjUVv6s9blvgvKNOrkl9OYDMaQawKOcJUq2EoWZ87Olj2zkOdohS', 0, NULL, 0, NULL, 'https://bom.edu.vn/public/upload/2024/12/avatar-zalo-nu-1.webp', NULL, 'ACTIVE', '2025-11-26 12:16:50', '2025-11-24 14:53:34', '2025-11-27 20:23:59'),
(23, 'Võ Duy Khoa', NULL, 'khoaduyvo99@gmail.com', '2025-11-25 21:00:30', '0327793283', NULL, NULL, NULL, '$2a$10$Z.4C87XFvbsUlJLmkJvIY.CjKIov3BM5Qxb.QC3ecpDR1/RwhZ6sS', 0, NULL, 0, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyCQTtXukjYYmbh2DNzNIUb4hfUpEYm5FcC2ZD1yoHAyCD6UT4r_0wnLhCDAk2lpL604&usqp=CAU', NULL, 'ACTIVE', '2025-12-06 19:17:49', '2025-11-25 20:59:59', '2025-12-06 19:17:50'),
(24, 'Võ Duy Khoa', NULL, 'gamergaming20192019@gmail.com', '2025-11-26 12:19:59', '0327793283', NULL, NULL, NULL, '$2a$10$.pDm6qNDm7e2.JqbK8EC8.MggDlVevR57v.JE25C81q4myvRjHycu', 0, NULL, 0, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyCQTtXukjYYmbh2DNzNIUb4hfUpEYm5FcC2ZD1yoHAyCD6UT4r_0wnLhCDAk2lpL604&usqp=CAU', NULL, 'ACTIVE', '2025-11-26 12:20:08', '2025-11-26 12:18:46', '2025-11-27 20:24:11'),
(25, 'Nguyen Ngoc Huy', 'ngochuy_2k4', 'nguyenhuypm1@gmail.com', '2025-11-27 16:02:57', '0327793284', NULL, 'male', '2004-10-10', '$2a$10$XKiAkpLLJNhyhwM1ItpprOzAemC3V5xg6jL9QuLCj5OP1zCR86fbe', 0, NULL, 5, '2025-11-28 15:07:47', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764249718/avatars/mht2lyxcp77sqnpkzndi.jpg', NULL, 'LOCKED', '2025-11-28 14:27:34', '2025-11-27 16:00:15', '2025-11-28 14:37:47'),
(26, 'Le Quoc Anh', NULL, 'quocanh0516@gmail.com', '2025-11-27 16:04:24', '0327793289', NULL, NULL, NULL, '$2a$10$7Qa7fSrLQ0QoKNaniM1Gx.P2Hc.cwLOk5jqIkanO5LEZOvccQYIPG', 0, NULL, 0, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyCQTtXukjYYmbh2DNzNIUb4hfUpEYm5FcC2ZD1yoHAyCD6UT4r_0wnLhCDAk2lpL604&usqp=CAU', NULL, 'ACTIVE', '2025-11-27 16:04:40', '2025-11-27 16:03:47', '2025-11-27 20:24:17'),
(106, 'Nguyen Văn A', NULL, 'nguyenvana@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$jhob0HHUxsAIPk/85ISFeOM6QSErwox51g93Si78FrTQF4aeFkJpK', 0, NULL, 0, NULL, NULL, NULL, 'ACTIVE', '2025-11-30 02:44:26', '2025-11-30 02:42:45', '2025-11-30 02:44:26'),
(107, 'Nguyễn Văn B', NULL, 'nguyenvanb@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$WlyXnWLvB4zRv1y1l4DILeZGzgdZimdZ1nuYaWBkjrAB7WvgCNLf6', 0, NULL, 0, NULL, NULL, NULL, 'ACTIVE', NULL, '2025-11-30 02:45:19', '2025-11-30 02:45:19'),
(108, 'Nguyen Van C', NULL, 'nguyenvanc@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$VryDfxPrer1T6TieqdDtc.K9C.qDLsLu7A3BbDN80xsYxg62Vnb/O', 0, NULL, 0, NULL, NULL, NULL, 'ACTIVE', '2025-11-30 02:47:04', '2025-11-30 02:45:53', '2025-11-30 02:47:04'),
(109, 'Nguyễn Văn D', NULL, 'nguyenvand@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$PDwUPhQ5nNbWLMtZRfKae.dZkc2/v0cLibEAeNpfMe5I3YQuW6fk.', 0, NULL, 0, NULL, NULL, NULL, 'ACTIVE', NULL, '2025-11-30 02:46:25', '2025-11-30 02:46:25'),
(110, 'Nguyễn Văn E', NULL, 'nguyenvane@gmail.com', NULL, '0332777154', NULL, NULL, NULL, '$2a$10$KBNELnw/GYPB4i1FnskP3OIGJEK7CT6dCv7iW2sRrrAK0x1hBTLTW', 0, NULL, 0, NULL, NULL, NULL, 'ACTIVE', NULL, '2025-11-30 02:46:51', '2025-11-30 02:46:51');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES
(47, 18, 1),
(43, 22, 7),
(42, 23, 7),
(44, 24, 7),
(45, 25, 7),
(46, 26, 7),
(55, 106, 2),
(56, 107, 3),
(57, 108, 4),
(58, 109, 5),
(59, 110, 6);

-- --------------------------------------------------------

--
-- Table structure for table `variant_attribute_values`
--

CREATE TABLE `variant_attribute_values` (
  `variant_id` bigint(20) NOT NULL,
  `attribute_id` bigint(20) NOT NULL,
  `attribute_value_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variant_attribute_values`
--

INSERT INTO `variant_attribute_values` (`variant_id`, `attribute_id`, `attribute_value_id`) VALUES
(1, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 1, 1),
(12, 1, 1),
(13, 1, 1),
(14, 1, 1),
(15, 1, 1),
(16, 1, 1),
(17, 1, 1),
(20, 1, 1),
(21, 1, 1),
(22, 1, 1),
(23, 1, 1),
(24, 1, 1),
(25, 1, 1),
(27, 1, 1),
(30, 1, 1),
(2, 1, 2),
(3, 1, 2),
(6, 1, 2),
(7, 1, 2),
(8, 1, 2),
(18, 1, 2),
(19, 1, 2),
(26, 1, 2),
(28, 1, 2),
(31, 1, 2),
(33, 1, 2),
(34, 1, 2),
(35, 1, 2),
(4, 1, 3),
(5, 1, 3),
(29, 1, 3),
(32, 1, 3),
(28, 2, 4),
(30, 2, 4),
(1, 2, 5),
(2, 2, 5),
(4, 2, 5),
(9, 2, 5),
(10, 2, 5),
(11, 2, 5),
(12, 2, 5),
(13, 2, 5),
(16, 2, 5),
(17, 2, 5),
(20, 2, 5),
(21, 2, 5),
(23, 2, 5),
(24, 2, 5),
(25, 2, 5),
(26, 2, 5),
(29, 2, 5),
(32, 2, 5),
(3, 2, 6),
(5, 2, 6),
(27, 2, 6),
(31, 2, 6),
(33, 2, 6),
(6, 3, 7),
(18, 3, 7),
(7, 3, 8),
(19, 3, 8),
(8, 3, 9),
(34, 3, 9),
(35, 3, 9);

-- --------------------------------------------------------

--
-- Table structure for table `variant_images`
--

CREATE TABLE `variant_images` (
  `id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `image_url` varchar(1024) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 1,
  `is_primary` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variant_images`
--

INSERT INTO `variant_images` (`id`, `variant_id`, `image_url`, `alt_text`, `sort_order`, `is_primary`, `created_at`) VALUES
(1, 1, 'https://png.pngtree.com/png-vector/20240202/ourlarge/pngtree-isolated-pack-of-black-t-shirt-front-and-back-view-png-image_11590745.png', 'Áo thun nam basic cổ tròn - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(2, 2, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000', 'Áo thun nam basic cổ tròn - Màu Trắng, size M', 1, 1, '2025-11-19 16:11:49'),
(3, 3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000', 'Áo thun nam basic cổ tròn - Màu Trắng, size L', 1, 1, '2025-11-19 16:11:49'),
(4, 4, 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'Quần jean nam slim fit - Màu Xanh navy, size M', 1, 1, '2025-11-19 16:11:49'),
(5, 5, 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'Quần jean nam slim fit - Màu Xanh navy, size L', 1, 1, '2025-11-19 16:11:49'),
(6, 6, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR640SRWZuL28EiQzJkTqE9nS2W_3xkvs9hbL-P1pv0jW7JATOS8X0CEo72EcDE8Yixvq7pr9cTFmEU6fFB8BXGDNK7rGSzmQ7gNRSsg61z_PGSBZHwogFVxBWHsRjtvxx5V6UMIuRm9Q&usqp=CAc', 'Giày sneaker trắng classic - Màu Trắng, size 40', 1, 1, '2025-11-19 16:11:49'),
(7, 7, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR640SRWZuL28EiQzJkTqE9nS2W_3xkvs9hbL-P1pv0jW7JATOS8X0CEo72EcDE8Yixvq7pr9cTFmEU6fFB8BXGDNK7rGSzmQ7gNRSsg61z_PGSBZHwogFVxBWHsRjtvxx5V6UMIuRm9Q&usqp=CAc', 'Giày sneaker trắng classic - Màu Trắng, size 41', 1, 1, '2025-11-19 16:11:49'),
(8, 8, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR640SRWZuL28EiQzJkTqE9nS2W_3xkvs9hbL-P1pv0jW7JATOS8X0CEo72EcDE8Yixvq7pr9cTFmEU6fFB8BXGDNK7rGSzmQ7gNRSsg61z_PGSBZHwogFVxBWHsRjtvxx5V6UMIuRm9Q&usqp=CAc', 'Giày sneaker trắng classic - Màu Trắng, size 42', 1, 1, '2025-11-19 16:11:49'),
(9, 9, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/05/bo-the-thao-nam-adidas-aeroready-hc4440-hc4431-mau-den-size-m-64745d40d9e87-29052023150728.jpg', 'Bộ thể thao nam Adidas - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(10, 10, 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936080327695-1.jpg.webp', 'Áo thun nữ basic cổ tròn - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(11, 11, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXuIrjWWrseQtwCZ96EUJXcuswNZ7YBDoXg&s', 'Áo sơ mi nữ công sở - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(12, 12, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2025/10/ao-len-cardigan-nu-tommy-hilfiger-cable-knit-mau-den-size-xs-68f729751f97a-21102025133429.jpg', 'Áo cardigan nữ dáng dài - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(13, 13, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTXIpH2k5Qp83ZUis_fcd_T9glLpzTWfkNTF7q-1zu2Xkc2tSk3B0q5C6rIW8C_tc2kqNWGDxU8kHa9vr2v0WoZKfh5FFm-X3qwssCE_hsX-GY9M1ODqPSTiDEKyByW29d7VPuAeEkM&usqp=CAc', 'Quần jean nữ basic - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(14, 14, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT62z5LteDfqP-uJDCL9nBOg4mHkgVg5yuYea3QM-YA_5zgt0IOS66kLPyovJycGjcCukhcaw_2XVNly4byteYbg_q8-RMCyHF8FP0OHd2BukKhQxIS97el8fbZdSBcZ2wFfhnb_yqj&usqp=CAc', 'Túi xách tay nữ da mềm - Màu Đen, không size', 1, 1, '2025-11-19 16:11:49'),
(15, 15, 'https://lavatino.com/wp-content/uploads/2023/11/wcb04-450x563.jpg', 'Ví da nữ cao cấp - Màu Đen, không size', 1, 1, '2025-11-19 16:11:49'),
(16, 16, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPfAm9m5Of2Ibi-wpIvSnb94MqE3BWfkEV-uF2l4KdRwAPIXHJHcloxrrGG-1PZqVC7BxM6fpbbWR1jx4Hf4ra8OvCwTbKUMUlwbRSugiUdecjxLoIekNssW4Aof7cQ610Y3rI5ZVI&usqp=CAc', 'Đầm dự tiệc nữ sang trọng - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(17, 17, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSGckrxfca-lnZ0MDrsOaWdrk4PBW9W73Kx-ESBmfNyEU_-XmXLgMkqCT-y7JqN_6SN2YGMvOZdpdzUg1Uix3sxDr9rWGOzByZGBsIEnsmMpQRhMWUW8NRrtjY3mRIXXthwhCmU_Txakjo&usqp=CAc', 'Đầm suông nữ basic - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(18, 18, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSuemliDDaOmxHjlGWXI7iYqHbAPE1ovH-9EcrQPyBss4NOBjk19ZB8haki0u_DF1sfyv5wWEnonigXUXtfYECvjgOPkKKJtjERH7kPgqDwGRSUgazvWURwByaL8QRlSs6vf8PCSJ4BjA&usqp=CAc', 'Giày sneaker nữ thời trang - Màu Trắng, size 40', 1, 1, '2025-11-19 16:11:49'),
(19, 19, 'https://cdn.vuahanghieu.com/unsafe/0x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/news/content/2024/10/giay-pickleball-nam-new-balance-all-court-mch696-k5-mau-trang-2-jpg-1728892140-14102024144900.jpg', 'Giày chạy bộ nam New Balance - Màu Trắng, size 41', 1, 1, '2025-11-19 16:11:49'),
(20, 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrCyH1GyPGt7ScpX6QL6UtWbV3-VXGvALhhQ&s', 'Bộ pijama nữ dễ thương - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(21, 21, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/06/ao-polo-nam-tommy-hilfiger-regular-fit-to8061559-mau-den-667d131320058-27062024142155.jpg', 'Áo polo nam Tommy Hilfiger - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(22, 22, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/03/that-lung-nam-hermes-h-guillochee-belt-buckle-reversible-leather-strap-32mm-hai-mat-mau-den-nau-65f3b331cd27f-15032024093217.jpg', 'Thắt lưng da nam Hermes - Màu Đen, không size', 1, 1, '2025-11-19 16:11:49'),
(23, 23, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQpg6jHm_i_MmZZtshI7uqXfuwSQKzfvRePgTvupywY04gPS85uyM3FbDcE1zAoQu5N7WA1sMNykJ7wwde9nsejI3zRbxlQUkG-ugrnmgaPiQjKtxL3uISWyM1BA6iBCRbIVJga0I8&usqp=CAc', 'Áo hoodie nam streetwear - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(24, 24, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQD73--9Tn3HwP_XrZB_4QpvptvaVNL4N8emcGrlzr7I4S1YPTkOm163ufCuKp0OPDd5wOaQXd2TbZ-cC6CFOHp-C9z_Mvg391Rjm31mZ_PVq_ey6CydcZndRDXXkFmYhypy7ESK6h8&usqp=CAc', 'Áo thun nữ streetwear - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(25, 25, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTzdyGqPmoHfRD9jEclG2JrZGrgeLm6CWsOc5Azwdk0FvEKJIq-BWmJSMSRbbyF3v0b014BR5_aZaNb9VDd5CyF7GeYi1cvwc-mJUXpAFfMDFaO5JrXPMVs2IgICl68qaSgEBr9LARDMQ&usqp=CAc', 'Bộ đồ bộ nữ streetwear - Màu Đen, size M', 1, 1, '2025-11-19 16:11:49'),
(26, 26, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/03/bo-quan-ao-coc-tay-nam-adidas-tiro-23-league-soccer-h44526-ib8083-mau-trang-65ea819257276-08032024101010.jpg', 'Bộ thể thao nam Adidas - Màu Trắng, size M', 1, 1, '2025-11-19 16:11:49'),
(27, 27, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJZJwoi0rpOKjVGylhfTh2aSUuaZGgbAFHjw&s', 'Bộ thể thao nam Adidas - Màu Đen, size L', 1, 1, '2025-11-19 16:11:49'),
(28, 28, 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936080326032.jpg.webp', 'Áo thun nữ basic cổ tròn - Màu Trắng, size S', 1, 1, '2025-11-19 16:11:49'),
(29, 29, 'https://cdn.hstatic.net/products/1000261224/ao-xanh-navy_b742e100fce5490b836b2326291d54cc_master.jpg', 'Áo thun nữ basic cổ tròn - Màu Xanh navy, size M', 1, 1, '2025-11-19 16:11:49'),
(30, 30, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTXIpH2k5Qp83ZUis_fcd_T9glLpzTWfkNTF7q-1zu2Xkc2tSk3B0q5C6rIW8C_tc2kqNWGDxU8kHa9vr2v0WoZKfh5FFm-X3qwssCE_hsX-GY9M1ODqPSTiDEKyByW29d7VPuAeEkM&usqp=CAc', 'Quần jean nữ basic - Màu Đen, size S', 1, 1, '2025-11-19 16:11:49'),
(31, 31, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKJquFqOhdHreqL9C-UDtCMxY7wMwMmEAuhQ&s', 'Quần jean nữ basic - Màu Trắng, size L', 1, 1, '2025-11-19 16:11:49'),
(32, 32, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/03/ao-polo-nam-tommy-hilfiger-slim-fit-icons-flag-mau-xanh-navy-size-xs-65fd5595a36c5-22032024165533.jpg', 'Áo polo nam Tommy Hilfiger - Màu Xanh navy, size M', 1, 1, '2025-11-19 16:11:49'),
(33, 33, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/449/458/products/anh-ghep-logo-web-1-402e4611-cf56-4980-8b49-1a4e146adab3.png', 'Áo polo nam Tommy Hilfiger - Màu Trắng, size L', 1, 1, '2025-11-19 16:11:49'),
(34, 34, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/12/giay-sneaker-unisex-puma-v-court-vulc-puma-v-coat-bulk-389907-01-white-mau-trang-size-42-65767a6931925-11122023095641.jpg', 'Giày sneaker nữ thời trang - Màu Trắng, size 42', 1, 1, '2025-11-19 16:11:49'),
(35, 35, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2023/05/giay-the-thao-new-balance-530-retro-running-navy-mr530sg-mau-trang-xam-646aed6a2e631-22052023111954.jpg', 'Giày chạy bộ nam New Balance - Màu Trắng, size 42', 1, 1, '2025-11-19 16:11:49');

-- --------------------------------------------------------

--
-- Table structure for table `verification_codes`
--

CREATE TABLE `verification_codes` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `type` enum('EMAIL_CHANGE','EMAIL_VERIFICATION','PASSWORD_RESET','PHONE_VERIFICATION','TWO_FACTOR') NOT NULL,
  `identifier` varchar(191) NOT NULL COMMENT 'email hoặc phone number',
  `code` varchar(10) NOT NULL,
  `token` varchar(64) DEFAULT NULL COMMENT 'Token cho link verification',
  `expires_at` datetime NOT NULL,
  `verified_at` datetime DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification_codes`
--

INSERT INTO `verification_codes` (`id`, `user_id`, `type`, `identifier`, `code`, `token`, `expires_at`, `verified_at`, `attempts`, `created_at`) VALUES
(1, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '911015', NULL, '2025-11-14 11:24:18', NULL, 0, '2025-11-14 11:14:18'),
(2, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '260874', NULL, '2025-11-14 12:46:35', NULL, 0, '2025-11-14 12:36:35'),
(3, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '337897', NULL, '2025-11-14 12:52:51', NULL, 0, '2025-11-14 12:42:51'),
(4, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '043181', NULL, '2025-11-14 12:54:36', NULL, 0, '2025-11-14 12:44:36'),
(5, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '870705', NULL, '2025-11-14 12:55:42', NULL, 0, '2025-11-14 12:45:42'),
(6, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '416635', NULL, '2025-11-14 13:01:11', NULL, 0, '2025-11-14 12:51:11'),
(7, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '173603', NULL, '2025-11-14 13:35:58', NULL, 0, '2025-11-14 13:25:58'),
(8, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '476411', NULL, '2025-11-14 13:40:51', NULL, 0, '2025-11-14 13:30:51'),
(9, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '353583', NULL, '2025-11-14 13:41:11', '2025-11-14 13:31:50', 0, '2025-11-14 13:31:11'),
(10, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '428366', NULL, '2025-11-14 13:44:32', '2025-11-14 13:34:47', 0, '2025-11-14 13:34:32'),
(11, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '008442', NULL, '2025-11-14 13:48:11', '2025-11-14 13:38:27', 0, '2025-11-14 13:38:11'),
(12, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '360268', NULL, '2025-11-14 13:49:53', '2025-11-14 13:40:07', 0, '2025-11-14 13:39:53'),
(13, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '213145', NULL, '2025-11-14 13:51:17', '2025-11-14 13:41:35', 0, '2025-11-14 13:41:17'),
(14, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '526411', NULL, '2025-11-14 13:54:16', '2025-11-14 13:44:33', 0, '2025-11-14 13:44:16'),
(15, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '470837', NULL, '2025-11-14 13:57:10', '2025-11-14 13:47:28', 0, '2025-11-14 13:47:10'),
(16, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '694146', NULL, '2025-11-14 13:59:21', '2025-11-14 13:49:37', 0, '2025-11-14 13:49:21'),
(17, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '695352', NULL, '2025-11-14 14:01:08', '2025-11-14 13:51:22', 0, '2025-11-14 13:51:08'),
(18, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi04@gmail.com', '654985', NULL, '2025-11-14 14:04:05', '2025-11-14 13:54:19', 0, '2025-11-14 13:54:05'),
(19, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '309536', NULL, '2025-11-14 15:35:00', NULL, 0, '2025-11-14 14:35:00'),
(20, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '934223', NULL, '2025-11-14 15:39:10', NULL, 0, '2025-11-14 14:39:10'),
(21, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '385048', NULL, '2025-11-14 15:40:19', NULL, 0, '2025-11-14 14:40:19'),
(22, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '169293', NULL, '2025-11-14 15:40:37', NULL, 0, '2025-11-14 14:40:37'),
(23, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '891657', NULL, '2025-11-14 15:42:39', NULL, 0, '2025-11-14 14:42:39'),
(24, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '008002', NULL, '2025-11-14 15:44:53', NULL, 0, '2025-11-14 14:44:53'),
(25, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '066080', NULL, '2025-11-14 17:39:13', '2025-11-14 16:44:58', 0, '2025-11-14 16:39:13'),
(26, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '145981', NULL, '2025-11-14 17:45:15', '2025-11-14 16:45:43', 0, '2025-11-14 16:45:15'),
(27, NULL, 'EMAIL_VERIFICATION', 'maianhkhoi01@gmail.com', '565256', NULL, '2025-11-23 18:45:34', NULL, 0, '2025-11-23 18:35:34'),
(28, NULL, 'EMAIL_VERIFICATION', 'khoaduyvo99@gmail.com', '940020', NULL, '2025-11-25 21:09:59', '2025-11-25 21:00:30', 0, '2025-11-25 20:59:59'),
(29, NULL, 'EMAIL_VERIFICATION', 'gamergaming20192019@gmail.com', '830450', NULL, '2025-11-26 12:28:46', '2025-11-26 12:19:59', 0, '2025-11-26 12:18:46'),
(30, NULL, 'PASSWORD_RESET', 'maianhkhoi@gmail.com', '725009', NULL, '2025-11-26 20:46:09', NULL, 0, '2025-11-26 19:46:09'),
(31, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '764961', NULL, '2025-11-26 20:48:16', NULL, 0, '2025-11-26 19:48:16'),
(32, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '592855', NULL, '2025-11-26 20:50:29', NULL, 0, '2025-11-26 19:50:29'),
(33, NULL, 'PASSWORD_RESET', 'maianhkhoi04@gmail.com', '106919', NULL, '2025-11-26 20:52:12', NULL, 0, '2025-11-26 19:52:12'),
(34, NULL, 'EMAIL_VERIFICATION', 'nguyenhuypm1@gmail.com', '030384', NULL, '2025-11-27 16:10:15', NULL, 0, '2025-11-27 16:00:15'),
(35, NULL, 'EMAIL_VERIFICATION', 'nguyenhuypm1@gmail.com', '096732', NULL, '2025-11-27 16:12:26', '2025-11-27 16:02:56', 0, '2025-11-27 16:02:26'),
(36, NULL, 'EMAIL_VERIFICATION', 'quocanh0516@gmail.com', '021974', NULL, '2025-11-27 16:13:47', '2025-11-27 16:04:24', 0, '2025-11-27 16:03:47'),
(37, NULL, 'PASSWORD_RESET', 'nguyenhuypm1@gmail.com', '871949', NULL, '2025-11-27 17:04:50', '2025-11-27 16:05:26', 0, '2025-11-27 16:04:50');

-- --------------------------------------------------------

--
-- Table structure for table `virtual_tryon_history`
--

CREATE TABLE `virtual_tryon_history` (
  `id` bigint(20) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `garment_image_url` text DEFAULT NULL,
  `model_image_url` text DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `result_image_url` text DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `virtual_tryon_history`
--

INSERT INTO `virtual_tryon_history` (`id`, `category`, `created_at`, `garment_image_url`, `model_image_url`, `product_id`, `result_image_url`, `user_id`, `variant_id`) VALUES
(1, 'upper_body', '2025-12-02 01:05:17.000000', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764612280/virtual-tryon-models/rw5gcnioksrte3vdq6ry.jpg', 2, 'https://replicate.delivery/yhqm/O70eDrD3tXT3HCTBrMXYtYMEKOmCznh4rq9aig7dLnruVc3KA/output.jpg', 23, 5),
(2, 'upper_body', '2025-12-02 01:06:45.000000', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764612390/virtual-tryon-models/oe8ri5zft7xumjtq9tsr.jpg', 2, 'https://replicate.delivery/yhqm/Mzrr2YAbOM4FC14lcH5B06w9g1iI3msfnIQs2zstueO1s4uVA/output.jpg', 23, 5),
(3, 'upper_body', '2025-12-02 01:26:19.000000', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764613503/virtual-tryon-models/u9enznyjx2alx4vvipav.jpg', 2, 'https://replicate.delivery/yhqm/vYnIQQalAbpxD1NnKNAoer6LLB5s8hAHkHj0zyORAt9kf4uVA/output.jpg', 23, 5),
(4, 'upper_body', '2025-12-02 01:27:20.000000', 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936080326032.jpg.webp', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764613622/virtual-tryon-models/dhaha5zk7ukcso3xbkk1.jpg', 5, 'https://replicate.delivery/yhqm/zjUScfcufThGb0XscRQPes7qGC5MZhLq3KnYQlM89eEhAk7WB/output.jpg', 23, 28),
(5, 'upper_body', '2025-12-02 01:28:56.000000', 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936080327695-1.jpg.webp', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764613699/virtual-tryon-models/sqrfjsdkflxi12508aoh.jpg', 5, 'https://replicate.delivery/yhqm/rGi2gZdmit44KFIejtgDraNeByrzeYnqU12jTBbG48QQDydrA/output.jpg', 23, 10),
(6, 'lower_body', '2025-12-02 01:29:59.000000', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTXIpH2k5Qp83ZUis_fcd_T9glLpzTWfkNTF7q-1zu2Xkc2tSk3B0q5C6rIW8C_tc2kqNWGDxU8kHa9vr2v0WoZKfh5FFm-X3qwssCE_hsX-GY9M1ODqPSTiDEKyByW29d7VPuAeEkM&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764613781/virtual-tryon-models/qz6hisvdqfnxxloaal0m.jpg', 8, 'https://replicate.delivery/yhqm/BVXjZ9O7MaafNC5z7L912eSccPn8lcY0eABty16eh7pdKk7WB/output.jpg', 23, 13),
(7, 'upper_body', '2025-12-02 01:33:51.000000', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRdThkHg1B-WhPYfaLk9cCHjzJ3_fW3OXgNpb46kfuXWU4wesz89I02vAcrjAINsBphzUlVguibkZX1U8e9UXhxyLHWNTA9i8NbORcbcMkUfD3sOc30TlMvGlzQnIbN5kx5naV1dg&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764613888/virtual-tryon-models/wefaob7cxsvnl3olwthi.jpg', 7, 'https://replicate.delivery/yhqm/kVGNvNnIpp55IlXUbmfUrCWGVSiFfTdsU4seE6bj6P3gMydrA/output.jpg', 23, 12),
(8, 'upper_body', '2025-12-02 01:43:16.000000', 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR1KPA4Il2Dp7PQZ3_3Ylv88dKdP80TTwhtuhBbrBtJif-gLuSABMmWVQ2Wz6HLYBOO-fFJbFITvWqgQzwq2ocgxqTK8Zuvg5jQuVWL9UFrLYG4qqFJdTIV2qkTJMPj11Bot3RrLn0&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764614577/virtual-tryon-models/qiarqthmdew1gbsqfwix.jpg', 2, 'https://replicate.delivery/yhqm/pJH0S0HHGzr6CV7v0TjKW1b6weAcuf5q1MJdzfYEVLlJek7WB/output.jpg', 23, 4),
(9, 'upper_body', '2025-12-02 01:47:05.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764614751/virtual-tryon-models/cuuqxuvzqljaxrpjnjtj.jpg', 2, 'https://replicate.delivery/yhqm/v7Wzop5FG9IGPhA4D95hVx3sgzh3ioyKlaEZVGsO7ECqUubF/output.jpg', 23, 4),
(10, 'upper_body', '2025-12-02 01:50:58.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764614996/virtual-tryon-models/rcd2xwxrijtoxcdnb5o7.jpg', 2, 'https://replicate.delivery/yhqm/hTiEacij577wOxWbOgWmPTiHnjAalDeBcAEQehhR0yDRW5uVA/output.jpg', 23, 4),
(11, 'upper_body', '2025-12-02 01:54:15.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764615228/virtual-tryon-models/edkmxgkebd8i66reww88.jpg', 2, 'https://replicate.delivery/yhqm/rOEibDIpyK6BEpfyenrQT3xTkM2k4ee7BKwx5K0jPp6cll7WB/output.jpg', 23, 5),
(12, 'lower_body', '2025-12-02 01:56:37.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764615357/virtual-tryon-models/fkpwzqsaszue1h31kdsp.jpg', 2, 'https://replicate.delivery/yhqm/JdyQnDjpssqoIp6sUE0RurblFtnrvh508eOKj62od4lytc3KA/output.jpg', 23, 5),
(13, 'upper_body', '2025-12-02 01:59:00.000000', 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRdThkHg1B-WhPYfaLk9cCHjzJ3_fW3OXgNpb46kfuXWU4wesz89I02vAcrjAINsBphzUlVguibkZX1U8e9UXhxyLHWNTA9i8NbORcbcMkUfD3sOc30TlMvGlzQnIbN5kx5naV1dg&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764615467/virtual-tryon-models/zl8rkc5o1g1uenfsmuxl.jpg', 7, 'https://replicate.delivery/yhqm/crHZhpqvEPJMCt4FuIoqtFlx7dsgmpf1VufJBPmogyD1d5uVA/output.jpg', 23, 12),
(14, 'upper_body', '2025-12-02 02:04:15.000000', 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2025/10/ao-len-cardigan-nu-tommy-hilfiger-cable-knit-mau-den-size-xs-68f729751f97a-21102025133429.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1764615748/virtual-tryon-models/nkyo6irhorgo1qda48d4.jpg', 7, 'https://replicate.delivery/yhqm/J75xgX29MwJrORpmIal2fgCXdXcszTxnQcUmv0WD7IaXxc3KA/output.jpg', 23, 12),
(15, 'upper_body', '2025-12-06 17:51:42.000000', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765018188/virtual-tryon-models/wjb1wr5jm1agoxgryqwh.jpg', 1, 'https://replicate.delivery/yhqm/fS5ay90MJVXCMyTIaCDg8pPuW7BoFfIu1KkB3eBr1yB7l3grA/output.jpg', 23, 2),
(16, 'upper_body', '2025-12-06 17:52:35.000000', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXuIrjWWrseQtwCZ96EUJXcuswNZ7YBDoXg&s', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765018338/virtual-tryon-models/nvsyl1rnn62bkp9vzshu.jpg', 6, 'https://replicate.delivery/yhqm/7fcdplClewrdBEjkRgRRddvfexgR2N48EqA6zaSUcnZOPvBXB/output.jpg', 23, 11),
(17, 'dresses', '2025-12-06 17:53:53.000000', 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPfAm9m5Of2Ibi-wpIvSnb94MqE3BWfkEV-uF2l4KdRwAPIXHJHcloxrrGG-1PZqVC7BxM6fpbbWR1jx4Hf4ra8OvCwTbKUMUlwbRSugiUdecjxLoIekNssW4Aof7cQ610Y3rI5ZVI&usqp=CAc', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765018416/virtual-tryon-models/ws9jeginswtpet5cfuar.jpg', 11, 'https://replicate.delivery/yhqm/eKuHECyAtMzmb6fqKWv4iTKQdonCCEZYf0hyPmibjw8Fq3grA/output.jpg', 23, 16),
(18, 'lower_body', '2025-12-06 18:27:14.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765020381/virtual-tryon-models/jw13qoekjfriduv13div.jpg', 2, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765020435/virtual-tryon-results/tegoxfxkov6fdmvkba0w.jpg', 23, 5),
(19, 'lower_body', '2025-12-06 18:28:09.000000', 'https://4men.com.vn/thumbs/2024/02/quan-jeans-xanh-dam-gieu-chi-mau-cam-form-slimfit-qj097-34879-p.jpg', 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765020469/virtual-tryon-models/gqromnbyj8qwgc3aduke.jpg', 2, 'https://res.cloudinary.com/dn4l1otfz/image/upload/v1765020490/virtual-tryon-results/j1tevkpqiaudvrehkfqp.jpg', 23, 4);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `created_at`) VALUES
(1, 18, '2025-11-19 08:05:00'),
(2, 24, '2025-11-26 12:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` bigint(20) NOT NULL,
  `wishlist_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `variant_id_coalesced` bigint(20) GENERATED ALWAYS AS (coalesce(`variant_id`,0)) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `wishlist_id`, `product_id`, `variant_id`, `created_at`) VALUES
(1, 1, 1, 2, '2025-11-19 08:05:10'),
(5, 1, 2, NULL, '2025-11-21 13:46:23'),
(6, 2, 3, NULL, '2025-11-26 12:26:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_tokens`
--
ALTER TABLE `access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `idx_at_user` (`user_id`,`expires_at`),
  ADD KEY `idx_token_hash` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_address_user` (`user_id`,`is_default`);

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_attr_name` (`name`);

--
-- Indexes for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_attr_val` (`attribute_id`,`value`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD KEY `FKt8g0udj2fq40771g38t2t011n` (`author_id`),
  ADD KEY `FKf2ci0ovwtuw6nsmcbvl20ucxv` (`category_id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name` (`name`),
  ADD UNIQUE KEY `unique_slug` (`slug`);

--
-- Indexes for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbovv268mg0vg57pkp0nb1bkq4` (`user_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart_user` (`user_id`,`status`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ci_cart` (`cart_id`),
  ADD KEY `fk_ci_product` (`product_id`),
  ADD KEY `fk_ci_variant` (`variant_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_cat_parent` (`parent_id`);

--
-- Indexes for table `comparison_items`
--
ALTER TABLE `comparison_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1o8nt1vcrsbmixb8davq44ptb` (`comparison_id`),
  ADD KEY `FKn60scs13uxpwfqdka9u6e10qa` (`product_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK61avbo6q6v5nscol726351x8l` (`handled_by`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cu_order` (`order_id`),
  ADD KEY `fk_cu_user` (`user_id`),
  ADD KEY `idx_cu_coupon` (`coupon_id`,`used_at`);

--
-- Indexes for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ir_variant_status` (`variant_id`,`status`),
  ADD KEY `idx_ir_expire` (`expires_at`),
  ADD KEY `fk_ir_order` (`order_id`),
  ADD KEY `idx_ir_order_status` (`order_id`,`status`);

--
-- Indexes for table `invitations`
--
ALTER TABLE `invitations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKt4i6esv44p6yi7cxq277vlo3i` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_expires_at` (`expires_at`),
  ADD KEY `FKh67axu8o0vump4ii8d89e2244` (`invited_by`);

--
-- Indexes for table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_lh_user` (`user_id`,`created_at`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `medias`
--
ALTER TABLE `medias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_media_owner` (`owner_user_id`,`created_at`),
  ADD KEY `FK7qaq3oq8cwc3uyxym4rhcp4iq` (`created_by`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_msg_thread` (`thread_id`,`created_at`),
  ADD KEY `fk_msg_sender` (`sender_id`);

--
-- Indexes for table `message_media`
--
ALTER TABLE `message_media`
  ADD PRIMARY KEY (`message_id`,`media_id`),
  ADD KEY `fk_mm_media` (`media_id`),
  ADD KEY `idx_mm_msg` (`message_id`,`sort_order`);

--
-- Indexes for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD PRIMARY KEY (`message_id`,`user_id`),
  ADD KEY `idx_mr_user` (`user_id`,`read_at`);

--
-- Indexes for table `message_threads`
--
ALTER TABLE `message_threads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mt_user` (`created_by`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `idx_order_user` (`user_id`,`created_at`),
  ADD KEY `idx_order_status` (`status`,`created_at`),
  ADD KEY `fk_order_addr` (`address_id`),
  ADD KEY `idx_order_payment_status` (`payment_status`,`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_oi_order` (`order_id`),
  ADD KEY `fk_oi_product` (`product_id`),
  ADD KEY `fk_oi_variant` (`variant_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_pay_provider_txn` (`provider`,`txn_ref`),
  ADD KEY `idx_pay_order` (`order_id`,`status`),
  ADD KEY `idx_pay_txn` (`provider`,`txn_ref`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_prod_brand` (`brand_id`),
  ADD KEY `idx_product_featured` (`is_featured`,`created_at`),
  ADD KEY `idx_product_views` (`view_count`),
  ADD KEY `idx_product_sold` (`sold_count`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_id`,`category_id`),
  ADD KEY `fk_pc_category` (`category_id`);

--
-- Indexes for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbwb7rmo5co6rc0ykyqyg9a3td` (`user_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pi_product` (`product_id`,`sort_order`),
  ADD KEY `fk_pi_variant` (`variant_id`);

--
-- Indexes for table `product_relations`
--
ALTER TABLE `product_relations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_prod_relation` (`product_id`,`related_product_id`,`relation_type`),
  ADD KEY `fk_pr_related` (`related_product_id`),
  ADD KEY `idx_pr_type` (`product_id`,`relation_type`,`sort_order`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_var_product` (`product_id`,`status`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rec_product` (`product_id`),
  ADD KEY `idx_rec_user` (`user_id`,`score`,`generated_at`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `idx_rt_user` (`user_id`,`expires_at`),
  ADD KEY `idx_token_hash` (`token_hash`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rev_product` (`product_id`,`status`,`created_at`),
  ADD KEY `idx_rev_user_product` (`user_id`,`product_id`),
  ADD KEY `fk_rev_oi` (`order_item_id`);

--
-- Indexes for table `review_media`
--
ALTER TABLE `review_media`
  ADD PRIMARY KEY (`review_id`,`media_id`),
  ADD KEY `fk_rm_media` (`media_id`),
  ADD KEY `idx_rm_review` (`review_id`,`sort_order`);

--
-- Indexes for table `review_summaries`
--
ALTER TABLE `review_summaries`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `fk_rp_perm` (`permission_id`);

--
-- Indexes for table `shop_settings`
--
ALTER TABLE `shop_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `social_accounts`
--
ALTER TABLE `social_accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_provider_user` (`provider`,`provider_user_id`),
  ADD KEY `idx_social_user` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_stock_variant` (`variant_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uq_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_role` (`user_id`,`role_id`),
  ADD KEY `fk_ur_role` (`role_id`);

--
-- Indexes for table `variant_attribute_values`
--
ALTER TABLE `variant_attribute_values`
  ADD PRIMARY KEY (`variant_id`,`attribute_id`),
  ADD KEY `fk_vav_attr` (`attribute_id`),
  ADD KEY `fk_vav_attr_val` (`attribute_value_id`);

--
-- Indexes for table `variant_images`
--
ALTER TABLE `variant_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vi_variant` (`variant_id`,`is_primary`,`sort_order`);

--
-- Indexes for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vc_identifier` (`identifier`,`type`,`expires_at`),
  ADD KEY `fk_vc_user` (`user_id`);

--
-- Indexes for table `virtual_tryon_history`
--
ALTER TABLE `virtual_tryon_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_wli` (`wishlist_id`,`product_id`,`variant_id_coalesced`),
  ADD KEY `fk_wli_prod` (`product_id`),
  ADD KEY `fk_wli_var` (`variant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_tokens`
--
ALTER TABLE `access_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attribute_values`
--
ALTER TABLE `attribute_values`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `blog_comments`
--
ALTER TABLE `blog_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=615;

--
-- AUTO_INCREMENT for table `comparison_items`
--
ALTER TABLE `comparison_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `invitations`
--
ALTER TABLE `invitations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT for table `medias`
--
ALTER TABLE `medias`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `message_threads`
--
ALTER TABLE `message_threads`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `product_relations`
--
ALTER TABLE `product_relations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `social_accounts`
--
ALTER TABLE `social_accounts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `variant_images`
--
ALTER TABLE `variant_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `verification_codes`
--
ALTER TABLE `verification_codes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `virtual_tryon_history`
--
ALTER TABLE `virtual_tryon_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_tokens`
--
ALTER TABLE `access_tokens`
  ADD CONSTRAINT `fk_at_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attribute_values`
--
ALTER TABLE `attribute_values`
  ADD CONSTRAINT `fk_attr_val_attr` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `FKf2ci0ovwtuw6nsmcbvl20ucxv` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`),
  ADD CONSTRAINT `FKt8g0udj2fq40771g38t2t011n` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD CONSTRAINT `FKbovv268mg0vg57pkp0nb1bkq4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ci_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_ci_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `comparison_items`
--
ALTER TABLE `comparison_items`
  ADD CONSTRAINT `FK1o8nt1vcrsbmixb8davq44ptb` FOREIGN KEY (`comparison_id`) REFERENCES `product_comparisons` (`id`),
  ADD CONSTRAINT `FKn60scs13uxpwfqdka9u6e10qa` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `FK61avbo6q6v5nscol726351x8l` FOREIGN KEY (`handled_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  ADD CONSTRAINT `fk_cu_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cu_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cu_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inventory_reservations`
--
ALTER TABLE `inventory_reservations`
  ADD CONSTRAINT `fk_ir_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ir_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invitations`
--
ALTER TABLE `invitations`
  ADD CONSTRAINT `FKh67axu8o0vump4ii8d89e2244` FOREIGN KEY (`invited_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `fk_lh_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medias`
--
ALTER TABLE `medias`
  ADD CONSTRAINT `FK7qaq3oq8cwc3uyxym4rhcp4iq` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `fk_media_owner` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_msg_thread` FOREIGN KEY (`thread_id`) REFERENCES `message_threads` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_media`
--
ALTER TABLE `message_media`
  ADD CONSTRAINT `fk_mm_media` FOREIGN KEY (`media_id`) REFERENCES `medias` (`id`),
  ADD CONSTRAINT `fk_mm_msg` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD CONSTRAINT `fk_mr_msg` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mr_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_threads`
--
ALTER TABLE `message_threads`
  ADD CONSTRAINT `fk_mt_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_addr` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_oi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_oi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_pay_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pc_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_comparisons`
--
ALTER TABLE `product_comparisons`
  ADD CONSTRAINT `FKbwb7rmo5co6rc0ykyqyg9a3td` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_pi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_relations`
--
ALTER TABLE `product_relations`
  ADD CONSTRAINT `fk_pr_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pr_related` FOREIGN KEY (`related_product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `fk_var_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `fk_rec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rec_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `refunds_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_rev_oi` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_rev_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_media`
--
ALTER TABLE `review_media`
  ADD CONSTRAINT `fk_rm_media` FOREIGN KEY (`media_id`) REFERENCES `medias` (`id`),
  ADD CONSTRAINT `fk_rm_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `review_summaries`
--
ALTER TABLE `review_summaries`
  ADD CONSTRAINT `fk_rs_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `social_accounts`
--
ALTER TABLE `social_accounts`
  ADD CONSTRAINT `fk_social_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `fk_stock_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_attribute_values`
--
ALTER TABLE `variant_attribute_values`
  ADD CONSTRAINT `fk_vav_attr` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vav_attr_val` FOREIGN KEY (`attribute_value_id`) REFERENCES `attribute_values` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vav_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `variant_images`
--
ALTER TABLE `variant_images`
  ADD CONSTRAINT `fk_vi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD CONSTRAINT `fk_vc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `fk_wli_prod` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wli_var` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_wli_wl` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
