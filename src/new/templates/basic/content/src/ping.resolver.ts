import { Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class Ping {
    @Field()
    alive: boolean = true;
    @Field()
    stamp: Date = new Date();
}

@Resolver()
export class PingResolver {
    @Query((_) => Ping)
    ping() {
        return new Ping();
    }
}
