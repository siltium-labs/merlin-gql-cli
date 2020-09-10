import { getManager } from "typeorm";
import { Customer } from "../models/customer/customer.model";
import { GqlContext } from "merlin-gql";

export const CustomerFunctions = {
  create: async (data: any, context: GqlContext) => {
    return new Promise<Customer>(async (resolve, reject) => {
      try {
        await getManager().transaction(async (em) => {
          const customer = new Customer();
          Object.assign(customer, data);
          const savedCustomer = await em.save(customer);
          resolve(savedCustomer);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  },
};
