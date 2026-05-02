package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TaskService(private val taskRepository: TaskRepository) {

    fun getAllTasks(): List<Task> = taskRepository.findAll()

    fun getTaskById(id: Long): Task = taskRepository.findById(id)
        .orElseThrow { RuntimeException("Task not found with id: $id") }

    @Transactional
    fun createTask(task: Task): Task = taskRepository.save(task)

    @Transactional
    fun updateTask(id: Long, updatedTask: Task): Task {
        val existingTask = getTaskById(id)
        val taskToSave = existingTask.copy(
            title = updatedTask.title,
            description = updatedTask.description,
            completed = updatedTask.completed
        )
        return taskRepository.save(taskToSave)
    }

    @Transactional
    fun deleteTask(id: Long) {
        if (!taskRepository.existsById(id)) {
            throw RuntimeException("Task not found with id: $id")
        }
        taskRepository.deleteById(id)
    }
}
