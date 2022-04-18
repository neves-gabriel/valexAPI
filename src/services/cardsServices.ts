import * as repository from "../repositories/cardRepository";
import * as rechargesServices from "../services/rechargesServices";
import * as purchasesServices from "../services/purchasesServices";
import * as errors from "../errors/index";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

interface Employee {
  id: number;
  fullName: string;
  cpf: string;
  email: string;
  companyId: number;
}

export async function create(
  employee: Employee,
  cardType: repository.TransactionTypes,
) {
  const { id: employeeId, fullName } = employee;

  await verifyType(cardType, employeeId);

  const number: string = await createCardNumber();

  const cardHolderName: string = createHolderName(fullName);

  const securityCode = faker.finance.creditCardCVV();
  const securityCodeHashed = await bcrypt.hash(securityCode, 10);

  const expirationDate = dayjs().add(5, "years").format("MM/YY");

  const card = {
    employeeId,
    number,
    cardHolderName,
    securityCode: securityCodeHashed,
    expirationDate,
    type: cardType,
  };

  const {
    rows: [{ id: cardId }],
  } = await repository.insert(card);

  return {
    id: cardId,
    employeeId,
    number: number,
    cardHolderName,
    securityCode,
    expirationDate,
    type: cardType,
  };
}

export async function activate(
  securityCode: string,
  password: string,
  cardId: number,
) {
  if (password.length !== 4)
    throw errors.UnprocessableEntity("Password must have 4 digits.");

  const card = await getById(cardId);

  verifyActive(card);

  verifyExpirationDate(card);

  const isAuthorized = await bcrypt.compare(securityCode, card.securityCode);
  if (!isAuthorized) throw errors.Unauthorized();

  const passwordHash = await bcrypt.hash(password, 10);

  const updateCard = {
    password: passwordHash,
  };

  await repository.update(cardId, updateCard);
}

export async function getBalance(cardId: number) {
  const recharges = await rechargesServices.sumRecharges(cardId);
  const payments = await purchasesServices.sumPayments(cardId);

  const balance = recharges - payments;

  return balance;
}

export async function getById(cardId: number) {
  const card = await repository.findById(cardId);
  if (!card) throw errors.NotFound();
  return card;
}

export async function getByCardDetails(
  number: string,
  cardholderName: string,
  expirationDate: string,
) {
  const card = await repository.findByCardDetails(
    number,
    cardholderName,
    expirationDate,
  );

  if (!card) throw errors.NotFound();

  return card;
}

export async function verifyCardId(cardId: number) {
  const card = await repository.findById(cardId);
  if (!card) throw errors.NotFound();
}

export function verifyExpirationDate(card: repository.Card) {
  const expirationDate = dayjs(card.expirationDate);
  if (expirationDate.diff() > 0) throw errors.Forbidden("Card is expired.");
}

export async function verifyPassword(card: repository.Card, password: string) {
  if (!card.password)
    throw errors.Forbidden(
      "Card is unactive. To activate, send a post request to /cards/cardId",
    );

  const passwordValidation = await bcrypt.compare(password, card.password);
  if (!passwordValidation) throw errors.Unauthorized();
}

function verifyActive(card: repository.Card) {
  if (card.password)
    throw errors.ConflictSpecificMessage("Card is already active");

  verifyExpirationDate(card);
}

async function verifyType(
  cardType: repository.TransactionTypes,
  employeeId: number,
) {
  const transactionTypes = [
    "groceries",
    "restaurant",
    "transport",
    "education",
    "health",
  ];

  if (!transactionTypes.includes(cardType))
    throw errors.Forbidden("Invalid card type.");

  const doesCardExist = await repository.findByTypeAndEmployeeId(
    cardType,
    employeeId,
  );
  if (doesCardExist) throw errors.Conflict(`Employee's ${cardType} card`);
}

async function createCardNumber() {
  let cardNumber = "";

  cardNumber = faker.finance.creditCardNumber("mastercard");

  return cardNumber;
}

function createHolderName(name: string): string {
  const splitName = name.split(" ");
  const firstName = splitName[0] + " ";
  const lastName = splitName[splitName.length - 1];

  let middleNames = splitName.slice(1, splitName.length - 1);
  middleNames = middleNames.filter((middlename) => middlename.length >= 3);

  let middleNamesInitial = middleNames
    .map((middlename) => middlename[0])
    .join(" ");

  if (middleNamesInitial.length > 0) middleNamesInitial += " ";

  const cardHolderName =
    `${firstName}${middleNamesInitial}${lastName}`.toUpperCase();

  return cardHolderName;
}

export async function getData(cardId: number) {
  console.log({ cardId });

  const balance = await getBalance(cardId);

  const transactions = await purchasesServices.getPayments(cardId);

  const recharges = await rechargesServices.getRecharges(cardId);

  const data = {
    balance,
    transactions,
    recharges,
  };

  return data;
}
