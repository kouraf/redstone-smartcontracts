/* eslint-disable */
import Arweave from 'arweave';
import { GQLNodeInterface, GQLTagInterface } from './gqlResult';

/**
 *
 * This class is be exposed as a global for contracts
 * as 'SmartWeave' and provides an API for getting further
 * information or using utility and crypto functions from
 * inside the contracts execution.
 *
 * It provides an api:
 *
 * - SmartWeave.transaction.id
 * - SmartWeave.transaction.reward
 * - SmartWeave.block.height
 * - SmartWeave.block.timestamp
 * - etc
 *
 * and access to some of the arweave utils:
 * - SmartWeave.arweave.utils
 * - SmartWeave.arweave.crypto
 * - SmartWeave.arweave.wallets
 * - SmartWeave.arweave.ar
 *
 * as well as access to the potentially non-deterministic full client:
 * - SmartWeave.unsafeClient
 *
 */
export class SmartWeaveGlobal {
  transaction: Transaction;
  block: Block;
  arweave: Pick<Arweave, 'ar' | 'wallets' | 'utils' | 'crypto'>;
  contract: {
    id: string;
    owner: string;
  };
  unsafeClient: Arweave;

  contracts: {
    readContractState: (contractId: string) => Promise<any>;
    viewContractState: (contractId: string, input: any) => Promise<any>;
    write: (contractId: string, input: any) => Promise<any>;
    refreshState: () => Promise<any>;
  };

  _activeTx?: GQLNodeInterface;

  constructor(arweave: Arweave, contract: { id: string; owner: string }) {
    this.unsafeClient = arweave;
    this.arweave = {
      ar: arweave.ar,
      utils: arweave.utils,
      wallets: arweave.wallets,
      crypto: arweave.crypto
    };
    this.contract = contract;
    this.transaction = new Transaction(this);
    this.block = new Block(this);
    this.contracts = {
      readContractState: (contractId: string, height?: number, returnValidity?: boolean) => {
        throw new Error('Not implemented');
      },

      viewContractState: (contractId: string, input: any) => {
        throw new Error('Not implemented');
      },

      write: (contractId: string, input: any) => {
        throw new Error('Not implemented');
      },

      refreshState: () => {
        throw new Error('Not implemented');
      }
    };
  }
}

// tslint:disable-next-line: max-classes-per-file
class Transaction {
  constructor(private readonly global: SmartWeaveGlobal) {}

  get id() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.id;
  }

  get owner() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.owner.address;
  }

  get target() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.recipient;
  }

  get tags(): GQLTagInterface[] {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.tags;
  }

  get quantity() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.quantity.winston;
  }

  get reward() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.fee.winston;
  }
}

// tslint:disable-next-line: max-classes-per-file
class Block {
  constructor(private readonly global: SmartWeaveGlobal) {}

  get height() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.block.height;
  }

  get indep_hash() {
    if (!this.global._activeTx) {
      throw new Error('No current Tx');
    }
    return this.global._activeTx.block.id;
  }

  get timestamp() {
    if (!this.global._activeTx) {
      throw new Error('No current tx');
    }
    return this.global._activeTx.block.timestamp;
  }
}
