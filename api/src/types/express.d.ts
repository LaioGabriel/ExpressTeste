import * as express from 'express';
import type { Usuario } from '../data/interfaces.ts';

declare global {
  namespace Express {
    interface Request {
      usuario?: Usuario;
    }
  }
}

