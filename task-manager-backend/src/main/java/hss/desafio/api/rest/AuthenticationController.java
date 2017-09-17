package hss.desafio.api.rest;

import hss.desafio.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@RestController
@RequestMapping(value = "/api/v1/auth")
public class AuthenticationController extends AbstractRestHandler {

    private AuthenticationService authenticationService;

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;

    }

    @RequestMapping(
            value = "",
            method = RequestMethod.POST,
            consumes = {"application/json", "application/xml"},
            produces = {"application/json", "application/xml"}
    )
    public ResponseEntity<?> auth(@RequestBody Auth auth, HttpServletRequest request, HttpServletResponse response) {

        if (this.authenticationService.validAuth(auth.username, auth.password)) {
            String user = currentUser(auth.username, this.authenticationService.nameAuth(auth.username), this.authenticationService.getToken(auth.username));
            return ResponseEntity.ok(user);
        } else {
            return new ResponseEntity<Object>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    @RequestMapping(
            value = "",
            method = RequestMethod.GET
    )
    public ResponseEntity<?> auth(HttpServletRequest request, HttpServletResponse response) {
        return ResponseEntity.ok("Ping!");
    }

    @SuppressWarnings("unused")
    private static class Auth {
        public String username;
        public String password;
    }

    private static String currentUser(String username, String name, String token) {
        return String.format("{ \"user\":[ { \"username\":\"%s\", \"name\":\"%s\"} ], \"token\":\"%s\" }", username, name, token);
    }

}
