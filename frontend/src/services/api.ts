export interface Task {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || '/api/tasks';

export const getTasks = async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
};

export const createTask = async (task: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, completed: false }),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
};

export const updateTask = async (id: number, task: Task): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete task");
};
