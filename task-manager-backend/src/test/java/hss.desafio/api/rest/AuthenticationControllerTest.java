package hss.desafio.api.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/**
 * {@AuthenticationControllerTest} é uma <i>test class</i> da JUnit
 * que valida a API REST configurada ma classe {@AuthenticationController}.
 *
 * ATENÇÃO: Esta aplicação é conceitual.
 *
 * @author  Humberto Sena Santos
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;


    /**
     * Verifica se a API REST '/api/v1/auth' está OK.
     *
     * @throws Exception
     */
    @Test
    public void authIsAlive() throws Exception {
        ResultActions result = this.mockMvc.perform(get("/api/v1/auth")).andDo(print()).andExpect(status().isOk());

        assertTrue("Ping!".equals(result.andReturn().getResponse().getContentAsString()));
    }

    /**
     * Realiza teste de autenticação, utilizando o usuário padrão registrado no arquivo application.properties
     *
     * @throws Exception
     */
    @Test
    public void authWithUserDefaultOK() throws  Exception {
        ResultActions result = this.mockMvc.perform(post("/api/v1/auth")
                                .content(login("desafio","123"))
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON)
                                ).andDo(print());

        result.andExpect(status().isOk());

        result.andExpect(jsonPath("$.user[0].username").value("desafio"));

        result.andExpect(jsonPath("$.user[0].name").value("FullStack 01"));
    }

    /**
     * Realiza teste com usuário inválido.
     *
     * @throws Exception
     */
    @Test
    public void authWithUserDefaultUnauthorized() throws  Exception {
        ResultActions result = this.mockMvc.perform(post("/api/v1/auth")
                .content(login("desafio","9696"))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
        ).andDo(print());

        result.andExpect(status().isUnauthorized());

    }


    private String login(String username, String password) {
        return String.format("{ \"username\" : \"%s\", \"password\" : \"%s\" }",username, password);
    }

}
