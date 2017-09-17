package hss.desafio.service;


import hss.desafio.dao.jpa.TaskRepository;
import hss.desafio.domain.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private static final Logger log = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    public TaskService() {
    }

    public Task createTask(Task task) {
        return this.taskRepository.save(task);
    }

    public Task getTask(long id) {
        return this.taskRepository.findOne(id);
    }

    public void deleteTask(Long id) {
        this.taskRepository.delete(id);
    }

    public void updateTask(Task task) {
        this.taskRepository.save(task);
    }

    public Page<Task> getAllTasks(Integer page, Integer size) {
        Page<Task> pageOfTasks = this.taskRepository.findAll(new PageRequest(page, size));
        return pageOfTasks;
    }

    public Page<Task> getAllTasksNotCompleted(Integer page, Integer size) {
        Page<Task> pageOfTasks = this.taskRepository.findAllTasksNotCompleted(new PageRequest(page, size));
        return pageOfTasks;
    }

    public  Page<Task> getAllTasksUniccupied(Integer page, Integer size) {
        Page<Task> pageOfTasks = this.taskRepository.findAllTasksUnoccupied(new PageRequest(page, size));
        return pageOfTasks;
    }
}
