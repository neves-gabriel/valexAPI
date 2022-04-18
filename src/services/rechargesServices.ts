import { Company } from "../repositories/companyRepository";
import * as cardServices from "./cardsServices";
import * as employeeServices from "./employeesService";
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as errors from "../errors/index";
import checkAmount from "../utils/checkAmount";

interface Recharge {
  cardId: number;
  amount: number;
}

export async function createRecharge(recharge: Recharge, company: Company) {
  const { cardId, amount } = recharge;

  const card = await cardServices.getById(cardId);

  const employee = await employeeServices.getById(card.employeeId);

  if (employee.companyId !== company.id) throw errors.Unauthorized();

  cardServices.verifyExpirationDate(card);

  checkAmount(amount);

  const insertRecharge = { cardId, amount };

  await rechargeRepository.insert(insertRecharge);
}

export async function sumRecharges(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId);

  const initialValue = 0;
  const sum = recharges.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, current: { amount: any }) => acc + current.amount,
    initialValue,
  );

  return sum;
}

export async function getRecharges(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId);

  return recharges;
}
