import { Counterparty } from "@entities/counterparty/model";
import * as api from "./api";

class CounterpartyStore {
  private _counterparties = $state<Counterparty[]>(api.loadCounterparties());

  private save() {
    api.saveCounterparties(this._counterparties);
  }

  get counterparties(): readonly Readonly<Counterparty>[] {
    return this._counterparties;
  }

  addCounterparty(counterparty: Counterparty): Counterparty {
    const existing = this._counterparties.find(p => p.login.uuid === counterparty.login.uuid);
      
    if(existing) {
      throw new Error('Counterparty already exists');
    }
    
    this._counterparties.push(counterparty);
    this.save();

    return counterparty;
  }

  getCounterpartyById(id: string): Counterparty | undefined {
    return this._counterparties.find((p) => p.login.uuid === id);
  }
}

export const counterpartyStore = new CounterpartyStore();