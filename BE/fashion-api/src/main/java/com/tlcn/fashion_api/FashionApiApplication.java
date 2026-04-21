package com.tlcn.fashion_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableScheduling
@SpringBootApplication
public class FashionApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FashionApiApplication.class, args);
	}

}
