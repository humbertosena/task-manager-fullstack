package hss.desafio;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@Configurable
@SpringBootApplication
@ComponentScan
public class Aplicacao {

    public static void main(String[] args) {
		System.out.println("Desafio FullStack - BackEnd");
        SpringApplication.run(Aplicacao.class, args);
    }
}