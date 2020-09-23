# kalkuler-omsorgsdager

Funksjon som beregner antall omsorgsdager: beregnOmsorgsdager

## How to install

```
npm i @navikt/kalkuler-omsorgsdager
```

## Signatur
Signatur for ```beregnOmsorgsdager```:

```
export type BeregnOmsorgsdagerType = (barn: Barn[], inkluderKoronadager: boolean) => Omsorgsprinsipper;
```

## Eksempel

```
import { beregnOmsorgsdager } from "@navikt/kalkuler-omsorgsdager/lib/kalkulerOmsorgsdager";
import { AlderType } from "@navikt/kalkuler-omsorgsdager/lib/types/Barn";
import Barn from "@navikt/kalkuler-omsorgsdager/lib/types/Barn";

const barn: Barn[] = [
  {
    søkerHarAleneomsorgFor: true,
    kroniskSykt: true,
    alder: AlderType.UNDER12,
    id: '1',
  },
  {
    alder: AlderType.UNDER12,
    id: '2',
  },
  {
    alder: AlderType.UNDER12,
    id: '3',
  },
];

const { grunnrett, aleneomsorg, kroniskSykt, aleneomsorgKroniskSyke } = beregnOmsorgsdager(barn, true);
```
