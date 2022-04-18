import * as businessesRepository from "../repositories/businessRepository";
import * as errors from "../errors/index";

export async function getById(businessId: number) {
  const business = await businessesRepository.findById(businessId);
  if (!business) throw errors.NotFound();
  return business;
}
