
package com.communitysolar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CommunitySolarApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommunitySolarApplication.class, args);
	}

}
