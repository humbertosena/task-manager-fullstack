package hss.desafio.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthenticationService {

    private Long expireHours = new Long(24);

    private String plainSecret = "desafio-fullstack";
    private String encodedSecret;

    @Autowired
    private UserService userService;

    @PostConstruct
    protected void init() {
        this.encodedSecret = generateEncodeSecret(this.plainSecret);
    }

    protected String generateEncodeSecret(String plainSecret) {
        if (StringUtils.isEmpty(plainSecret)) {
            throw new IllegalArgumentException("JWT secret cannot be null or empty.");
        } else {
            return Base64.getEncoder().encodeToString(this.plainSecret.getBytes());
        }
    }

    protected Date getExpirationTime() {
        Long expireInMilis = TimeUnit.HOURS.toMillis(this.expireHours);
        return new Date(expireInMilis + (new Date()).getTime());
    }

    protected String getToken(String encodedSecret, String username) {

        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(username) // usar username
                .claim("username", username) // usar role
                .setIssuedAt(new Date())
                .setExpiration(getExpirationTime())
                .signWith(SignatureAlgorithm.HS512, encodedSecret)
                .compact();
    }

    public String getToken(String username) {
        return getToken(this.encodedSecret, username);
    }

    public boolean validAuth(String username, String password) {
        return userService.isUserValid(username, password);
    }

    public String nameAuth(String username) {
        return this.userService.getName(username);
    }

}
