# Build-something-PA2577


## DEV:
docker-compose up --build

# Deploy to Minikube:
## Deploy Database:

```bash
kubectl apply -f db-deployment.yaml
```

## Deploy Backend:

```bash
kubectl apply -f backend-deployment.yaml
```

## Deploy Frontend:

```bash
kubectl apply -f frontend-deployment.yaml
```

## Verify Deployments:

```bash
kubectl get pods
kubectl get services
```

## open up the tunnel if needed:

```bash
minikube tunnel
```


## Clean Up:
```bash
kubectl delete deployment wordle-frontend
kubectl delete service wordle-frontend

kubectl delete deployment wordle-backend
kubectl delete service wordle-backend

kubectl delete deployment db
kubectl delete service db
kubectl delete pvc mysql-pvc
kubectl delete secret db-secret
```

Or if you got the guts:
```bash
kubectl delete all --all
```

## Database Schema:
Go into the mysql pod:
```bash
kubectl exec -it db-<pod-id> -- /bin/bash
```

Then login to mysql:
```bash
mysql -u root -p
<Write your password here>
```
```
use wordlebase;
```

Then create the database wordlebase if it does not exist:
```sql
CREATE DATABASE wordlebase;
```

Then create the tables in wordlebase:

```sql
-- Adminer 4.8.1 MySQL 8.0.39 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `word_provided_link`;
CREATE TABLE `word_provided_link` (
  `word_provide_link_id` int NOT NULL AUTO_INCREMENT,
  `word_search_id` int NOT NULL,
  `words_id` int NOT NULL,
  PRIMARY KEY (`word_provide_link_id`),
  KEY `word_search_id` (`word_search_id`),
  KEY `words_id` (`words_id`),
  CONSTRAINT `word_provided_link_ibfk_1` FOREIGN KEY (`word_search_id`) REFERENCES `wordle_search` (`wordle_search_id`),
  CONSTRAINT `word_provided_link_ibfk_2` FOREIGN KEY (`words_id`) REFERENCES `words` (`words_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `wordle_search`;
CREATE TABLE `wordle_search` (
  `wordle_search_id` int NOT NULL AUTO_INCREMENT,
  `correct_chars` varchar(50) NOT NULL,
  `excluded_chars` varchar(50) NOT NULL,
  `included_chars` varchar(50) NOT NULL,
  `searched_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wordle_search_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `words`;
CREATE TABLE `words` (
  `words_id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
  PRIMARY KEY (`words_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2024-11-28 17:59:53
```


Then inert the words by using the following endpoint:
```bash
POST http://localhost:3000/insert/words
```
with a body from the file `words.json`