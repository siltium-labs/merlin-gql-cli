import { Resolver, Field, ObjectType, Query } from "type-graphql";
import fetch from "node-fetch";
import * as fs from "fs";

@ObjectType()
export class Todo {
  @Field()
  title: string = "";

  @Field()
  completed: boolean = false;
}

@Resolver()
export class TodoResolver {
  @Query((_) => [Todo])
  async todosFromApi() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos: Todo[] = await response.json();
    return todos;
  }

  @Query((_) => [Todo])
  async todosFromFile() {
    const todosFilecontent = fs.readFileSync(`${__dirname}/../../todos.json`);
    const todos: Todo[] = JSON.parse(todosFilecontent.toString());
    return todos;
  }
}
