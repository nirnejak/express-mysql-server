CREATE TABLE todo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL default false,
  due_date DATE
)

/* Get all todos */
SELECT * FROM todo;

/* Get a todo */
SELECT * FROM todo WHERE todo.id = 3;

/* Add todo */
INSERT INTO todo(title) values('Get Groceries');
