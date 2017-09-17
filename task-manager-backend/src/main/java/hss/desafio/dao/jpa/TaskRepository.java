package hss.desafio.dao.jpa;

import hss.desafio.domain.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

    @Override
    Page<Task> findAll(Pageable pageable);

    @Query("select t from Task t where t.completed = false")
    Page<Task> findAllTasksNotCompleted(Pageable pageable);

    @Query("select t from Task t where t.completed = false and t.assigned is null")
    Page<Task> findAllTasksUnoccupied(Pageable pageable);



}
