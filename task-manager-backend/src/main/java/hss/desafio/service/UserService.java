package hss.desafio.service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Configuration
@ConfigurationProperties("app")
public class UserService {

    private List<User> users = new ArrayList<>();

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public Boolean isUserValid(String username, String password) {
        boolean result = false;
        for (User user : this.users) {
            if (user.getUsername().equalsIgnoreCase(username) && user.getPassword().equalsIgnoreCase(password))
                result = true;
        }
        return result;
    }

    public String getName(String username) {
        String result = "";
        for (User user : this.users) {
            if (user.getUsername().equalsIgnoreCase(username))
                result = user.getName();
        }
        return result;
    }

    public boolean checkUserName(String username) {
        boolean result = false;
        for (User user : this.users) {
            if (user.getUsername().equalsIgnoreCase(username))
                result = true;
        }
        return result;
    }


    public static class User {

        private String name;
        private String username;
        private String password;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

    }

}
