package com.example.demo

import jakarta.persistence.*

@Entity
@Table(name = "tasks")
data class Task(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val title: String,
    
    @Column(nullable = true)
    val description: String? = null,
    
    @Column(nullable = false)
    var completed: Boolean = false
) {
    // No-arg constructor for JPA
    constructor() : this(0, "", null, false)
}
