package com.example.demo

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = ["*"]) // Allow Vite dev server
class TaskController(private val taskService: TaskService) {

    @GetMapping
    fun getAllTasks(): List<Task> = taskService.getAllTasks()

    @GetMapping("/{id}")
    fun getTaskById(@PathVariable id: Long): Task = taskService.getTaskById(id)

    @PostMapping
    fun createTask(@RequestBody task: Task): Task = taskService.createTask(task)

    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: Long, @RequestBody task: Task): Task = 
        taskService.updateTask(id, task)

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: Long) {
        taskService.deleteTask(id)
    }
}
