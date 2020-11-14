CREATE TABLE todo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL default false,
  image VARCHAR(255),
  due_date DATE
)

/* Get all todos */
SELECT * FROM todo;

/* Get a todo */
SELECT * FROM todo WHERE todo.id = 3;

/* Add todo */
INSERT INTO todo(title, due_date, image) values('Get Groceries', '2020-11-15' ,'abc');
