package hss.desafio.api.rest;

import hss.desafio.domain.Task;
import hss.desafio.domain.User;
import hss.desafio.exception.DataFormatException;
import hss.desafio.service.TaskService;
import hss.desafio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@RestController
@RequestMapping(value = "/api/v1/tasks")
public class TaskManagerController extends AbstractRestHandler {

    private final TaskService taskService;


    private final UserService userService;

    @Autowired
    public TaskManagerController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @RequestMapping("/")
    public String index() {
        return "Ping!";
    }


    // Operações básicas
    @RequestMapping( value = "",
            method = RequestMethod.POST
    )
    @ResponseStatus(HttpStatus.CREATED)
    public void createTask(@RequestBody Task task, HttpServletRequest request, HttpServletResponse response) {
        Task createdTask = this.taskService.createTask(task);
        response.setHeader("Location", request.getRequestURL().append("/").append(createdTask.getId()).toString());
    }

    @RequestMapping(value = "/{id}",
            method = RequestMethod.DELETE,
            consumes = {"application/json"}
    )
    @ResponseStatus(HttpStatus.OK)
    public void deleteTask(@PathVariable("id") Long id,
                                         HttpServletRequest request, HttpServletResponse response) throws Exception {
        checkResourceFound(this.taskService.getTask(id));
        this.taskService.deleteTask(id);
    }

    @RequestMapping(value = "/{id}",
            method = RequestMethod.GET
    )
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody Task getTask(@PathVariable("id") Long id,
                                      HttpServletRequest request, HttpServletResponse response) throws Exception {
        Task task = this.taskService.getTask(id);
        checkResourceFound(task);
        return task;
    }

    @RequestMapping(value = "/{id}",
            method = RequestMethod.PUT
    )
    public void updateTask(@PathVariable("id") Long id,
                                         @RequestBody Task task,
                                         HttpServletRequest request, HttpServletResponse response) {

        checkResourceFound(this.taskService.getTask(id));

        if (id != task.getId()) throw new DataFormatException("ID doesn't match!");
        this.taskService.updateTask(task);

        if (id.equals(task.getId())) {
            this.taskService.updateTask(task);
            response.setStatus(HttpStatus.NO_CONTENT.value());
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }

    }

    // Operações Especiais (Lista, ações, outros)

    @RequestMapping(value = "",
            method = RequestMethod.GET
    )
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody Page<Task> getAllTask(
                        @RequestParam(value = "page", required = true, defaultValue = DEFAULT_PAGE_NUM) Integer page,
                        @RequestParam(value = "size", required = true, defaultValue = DEFAULT_PAGE_SIZE) Integer size,
                        HttpServletRequest request, HttpServletResponse response) {

        return this.taskService.getAllTasks(page,size);
    }

    @RequestMapping(value = "/not-completed",
            method = RequestMethod.GET
    )
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody Page<Task> findTasksNotCompleted(
            @RequestParam(value = "page", required = true, defaultValue = DEFAULT_PAGE_NUM) Integer page,
            @RequestParam(value = "size", required = true, defaultValue = DEFAULT_PAGE_SIZE) Integer size,
            HttpServletRequest request, HttpServletResponse response) {
        return this.taskService.getAllTasksNotCompleted(page,size);
    }

    @RequestMapping(value = "/unoccupied",
            method = RequestMethod.GET,
            consumes = {"application/json"}
    )
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody Page<Task> findTasksUnoccupied(
            @RequestParam(value = "page", required = true, defaultValue = DEFAULT_PAGE_NUM) Integer page,
            @RequestParam(value = "size", required = true, defaultValue = DEFAULT_PAGE_SIZE) Integer size,
            HttpServletRequest request, HttpServletResponse response) {
        return this.taskService.getAllTasksUniccupied(page,size);
    }


    @RequestMapping(value = "/{id}/completed/{user}",
            method = RequestMethod.PUT
    )
    public void taskCompleted(@PathVariable("id") Long id,
                                            @PathVariable("user") String user,
                                            HttpServletRequest request, HttpServletResponse response) {
        Task task = this.taskService.getTask(id);
        checkResourceFound(task);

        if (user.equalsIgnoreCase(task.getAssigned().getUsername())) {
            task.setCompleted(true);
            this.taskService.updateTask(task);
            response.setStatus(HttpStatus.NO_CONTENT.value());
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
    }

    @RequestMapping(value = "/{id}/unassigned/{user}",
            method = RequestMethod.PUT
    )
    public void unassigned(@PathVariable("id") Long id,
                           @PathVariable("user") String user,
                           HttpServletRequest request, HttpServletResponse response) {
        Task task = this.taskService.getTask(id);
        checkResourceFound(task);

        if (user.equalsIgnoreCase(task.getAssigned().getUsername())) {
            task.setAssigned(null);
            this.taskService.updateTask(task);
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }

    }

    @RequestMapping(value = "/{id}/assigned/{user}",
            method = RequestMethod.PUT
    )
    public void assigned(@PathVariable("id") Long id,
                         @PathVariable("user") String user,
                         HttpServletRequest request, HttpServletResponse response) {
        Task task = this.taskService.getTask(id);
        checkResourceFound(task);

        if (isUnassigned(task.getAssigned()) && this.userService.checkUserName(user) ) {
            User userTask = new User(this.userService.getName(user),user);
            task.setAssigned(userTask);
            this.taskService.updateTask(task);
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
    }





    // Métodos privados
    private Boolean isUnassigned(User u) {
        return u == null || u.getUsername() == null || u.getUsername().isEmpty();
    }














}