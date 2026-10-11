import { CommitDemo } from "./demos/commit"
import { ContextDemo } from "./demos/context"
import { MemoDemo } from "./demos/memo"
import { OwnershipDemo } from "./demos/ownership"
import { RefsDemo } from "./demos/refs"
import { TreeDemo } from "./demos/tree"
import { meta } from "./meta"
import { samples } from "./samples"
import { sectionIds } from "./sections"
import type { SectionId } from "./sections"
import { Code } from "@/components/blog/code"
import { Post } from "@/components/blog/post"
import { Lead, Point, Points, Prose } from "@/components/blog/prose"

const labels: Record<SectionId, string> = {
  model: "model",
  rule: "de regel",
  commit: "commit",
  state: "state",
  memo: "memo",
  context: "context",
  refs: "refs",
  recap: "recap",
}

export function Nl() {
  return (
    <Post
      locale="nl"
      meta={meta}
      order={sectionIds}
      labels={labels}
      lead={
        <>
          <p>
            Dit begon als slides voor een talk over React. Op een slide kun je
            alleen een plaatje van een render laten zien, dus hier zijn de
            plaatjes echt: elk blok in een diagram hieronder wordt getekend door
            een echt component op deze pagina.
          </p>
          <p>
            Een blok licht op wanneer React dat component aanroept, en het getal
            erboven telt hoe vaak dat is gebeurd. Onderstreepte blokken kun je
            aanklikken.
          </p>
        </>
      }
      bodies={{
        model: <Model />,
        rule: <Rule />,
        commit: <Commit />,
        state: <State />,
        memo: <Memo />,
        context: <Context />,
        refs: <Refs />,
        recap: <Recap />,
      }}
    />
  )
}

function Model() {
  return (
    <>
      <Lead>React is geen template engine.</Lead>
      <Prose>
        <p>
          Een template wordt één keer gevuld met data. Alles wat daarna gebeurt
          is losse JavaScript, die elementen opzoekt en aanpast.
        </p>
      </Prose>
      <Code>{samples.template}</Code>
      <Code>{samples.listener}</Code>
      <Prose>
        <p>
          React vraagt om een andere manier van denken. Een component is een
          functie. Die krijgt de huidige state en geeft terug hoe de UI er voor
          die state uit moet zien.
        </p>
      </Prose>
      <Code>{samples.component}</Code>
      <Prose>
        <p>
          Je schrijft nooit de code die de pagina aanpast. Je beschrijft de UI
          voor één state, en als de state verandert roept React de functie
          opnieuw aan en zoekt zelf het verschil uit:{" "}
          <code>UI = fn(state)</code>.
        </p>
        <p>
          De rest van deze post gaat over die ene stap. Welke functies roept
          React opnieuw aan, en waarom juist die?
        </p>
      </Prose>
    </>
  )
}

function Rule() {
  return (
    <>
      <Prose>
        <p>
          State is data die React voor je bewaart tussen renders. Je komt erbij
          via <code>useState</code>, <code>useReducer</code>,{" "}
          <code>useSyncExternalStore</code> of <code>useContext</code>. Omdat
          React je de state aanreikt, weet React ook wanneer je die verandert,
          en een verandering plant een render in.
        </p>
        <p>Wat daarna gebeurt is het hele reactivity model:</p>
        <ol>
          <li>state verandert</li>
          <li>het component dat de state bezit rendert opnieuw</li>
          <li>de children renderen mee</li>
        </ol>
      </Prose>
      <TreeDemo />
      <Prose>
        <p>
          Renders gaan de tree in naar beneden. Nooit omhoog en nooit opzij.
          Update <code>App</code> en alle zeven components renderen. Update{" "}
          <code>Logo</code> en het is er één.
        </p>
        <p>
          React controleert niet of een child andere props kreeg. De parent
          rendert, dus het child rendert. Het enige verschil tussen die twee
          updates is waar de state leeft.
        </p>
      </Prose>
    </>
  )
}

function Commit() {
  return (
    <>
      <Prose>
        <p>
          "Rerenderen" klinkt duur, omdat het klinkt alsof de browser aan het
          werk gaat. Meestal is dat niet zo. Een render is React die jouw
          functie aanroept. Daarna vergelijkt React het resultaat met het
          vorige, en alleen de verschillen worden naar de DOM geschreven. Die
          tweede stap is de commit.
        </p>
      </Prose>
      <CommitDemo />
      <Prose>
        <p>
          <code>Label</code> rendert bij elke klik en zijn DOM node wordt nooit
          aangeraakt. Een render die niets verandert kost een functieaanroep en
          een vergelijking. Daarom zijn de meeste rerenders prima.
        </p>
        <p>
          Het wordt pas een probleem als de functie zelf traag is, of als het er
          heel veel zijn. Goed om te weten voordat je naar een oplossing grijpt.
        </p>
      </Prose>
    </>
  )
}

function State() {
  return (
    <>
      <Lead>Welk component heeft deze state echt nodig?</Lead>
      <Prose>
        <p>
          Als renders naar beneden lopen vanaf de plek waar de state leeft, dan
          bepaalt die plek hoeveel er rendert. Neem een account screen met een
          button die een modal opent. De voor de hand liggende plek voor{" "}
          <code>isOpen</code> is het screen.
        </p>
      </Prose>
      <OwnershipDemo />
      <Prose>
        <p>
          Met de state in <code>AccountScreen</code> renderen bij het openen van
          de modal ook <code>Overview</code> en <code>Feed</code>, die er niets
          mee te maken hebben. Verplaats de state naar een component dat alleen
          de button en de modal bevat, en dezelfde klik rendert alleen die.
        </p>
        <p>
          State hoort dus zo laag mogelijk. Buttons, dropdowns, modals en inputs
          kunnen bijna altijd hun eigen state bezitten. Lift state alleen als
          meerdere components hem echt delen, en dan niet verder dan hun laagste
          gedeelde parent.
        </p>
        <p>
          Er is hier niets geoptimaliseerd. De state is verhuisd, en de render
          boundary verhuisde mee.
        </p>
      </Prose>
    </>
  )
}

function Memo() {
  return (
    <>
      <Prose>
        <p>
          <code>memo</code> geeft een component een uitweg. Als de parent
          rendert, vergelijkt React eerst de nieuwe props met de vorige. Zijn ze
          allemaal hetzelfde, dan wordt het component overgeslagen, met alles
          eronder.
        </p>
        <p>
          Die vergelijking gaat op reference. Een object of functie die tijdens
          de render van de parent wordt aangemaakt is elke keer een nieuwe.
          Daarom komt <code>memo</code> zelden alleen: het object heeft{" "}
          <code>useMemo</code> nodig en de callback <code>useCallback</code>.
        </p>
      </Prose>
      <MemoDemo />
      <Prose>
        <p>
          Zet alleen <code>memo</code> aan en er verandert niets, want{" "}
          <code>filters</code> en <code>onSelect</code> zijn elke render nieuw.
          Het overslaan begint pas als ze allebei stable zijn. Haal er één weer
          weg en het werkt niet meer, zonder error of warning.
        </p>
        <p>
          Dat maakt memoization fragiel. En sommige renders houdt het nooit
          tegen: de eigen state van het component, een context die het leest, en
          props die echt veranderd zijn.
        </p>
        <p>
          De hooks hebben zelf ook een prijs. Ze bewaren een waarde en
          vergelijken bij elke render de dependencies. Hier kost dat meer dan
          het oplevert:
        </p>
      </Prose>
      <Code>{samples.cheap}</Code>
      <Prose>
        <p>
          <code>useCallback</code> voorkomt op zichzelf geen enkele render. Het
          loont pas als iets de reference vergelijkt: een <code>memo</code>{" "}
          component, de dependencies van een <code>useEffect</code>, of een
          library die stable references verwacht.
        </p>
        <p>
          Voordat ik iets memoize vraag ik dus eerst waarom het component
          überhaupt rendert, en daarna werk ik in deze volgorde:
        </p>
        <ol>
          <li>uitzoeken waar de render begint</li>
          <li>de state zo laag mogelijk zetten</li>
          <li>composition gebruiken</li>
          <li>memoizen wat dan nog duur is</li>
        </ol>
        <p>
          De React Compiler schrijft de <code>useMemo</code> en{" "}
          <code>useCallback</code> voor je. Waar je state leeft bepaalt hij
          niet, dus de eerste drie stappen blijven van jou.
        </p>
      </Prose>
    </>
  )
}

function Context() {
  return (
    <>
      <Lead>Context is een subscription.</Lead>
      <Prose>
        <p>
          Context lost prop drilling op. Een provider maakt een value
          beschikbaar, en elk component eronder kan die lezen zonder dat de
          components ertussen hem doorgeven.
        </p>
        <p>
          Voor rendering helpt het om <code>useContext</code> te zien als een
          subscription op de value van de provider. Verandert de value, dan
          rendert elk component dat de context leest. De rest blijft met rust.
        </p>
      </Prose>
      <ContextDemo />
      <Prose>
        <p>
          Begin met één context en toggle de sidebar. Alle drie de consumers
          renderen, ook <code>OpenButton</code>, die alleen een functie wil. Een
          context werkt op de hele value: je abonneert je op het object, niet op
          een veld erin.
        </p>
        <p>
          <code>Content</code> rendert niet. Het leest geen context, en het is
          als <code>children</code> aan de provider meegegeven, dus als de
          provider opnieuw rendert maakt hij <code>Content</code> niet opnieuw
          aan. Dat is de composition uit het lijstje hierboven.
        </p>
        <p>
          Klik nu op de provider. Aan de sidebar verandert niets, maar het value
          object wordt opnieuw opgebouwd, dus elke consumer rendert voor niets.{" "}
          <code>useMemo</code> lost dat geval op, en alleen dat geval: toggle de
          sidebar en alles is weer als eerst.
        </p>
        <p>
          Splitsen doet de rest. De data gaat in de ene context en de functies
          in de andere. De functies veranderen nooit, dus een component dat
          alleen de sidebar opent rendert nooit meer opnieuw.
        </p>
      </Prose>
      <Code>{samples.consumer}</Code>
      <Prose>
        <p>
          Context is geen gratis global state. Eén grote context koppelt elke
          consumer aan elke update, en een consumer kan alleen kiezen welke
          context hij volgt.
        </p>
      </Prose>
    </>
  )
}

function Refs() {
  return (
    <>
      <Prose>
        <p>
          Een ref bewaart ook een waarde tussen renders. Het verschil met state
          is één ding: een ref aanpassen vertelt React niets, dus er volgt geen
          render.
        </p>
      </Prose>
      <RefsDemo />
      <Prose>
        <p>
          Het gevulde vierkantje is state, het open vierkantje is de ref. Klik
          op <code>RefButton</code> en de waarde loopt op, maar er licht geen
          blok op en <code>Screen</code> blijft het oude getal tonen. Pas bij de
          volgende state update wordt er gerenderd, en dan loopt het scherm weer
          gelijk.
        </p>
        <p>
          Dat maakt refs handig en gevaarlijk. De vraag is of de waarde
          zichtbaar moet zijn in de UI. Zo ja, dan is het state. Zo nee, dan is
          een ref prima: een timer id, een vorige waarde, een flag in een event
          handler, een render count. De tellers in deze diagrammen staan om
          dezelfde reden ook buiten state: een render tellen mag er zelf geen
          veroorzaken.
        </p>
        <p>Het andere gebruik is de DOM node zelf, voor dingen als focus:</p>
      </Prose>
      <Code>{samples.focus}</Code>
      <Prose>
        <p>State is voor de UI. Refs zijn de escape hatch.</p>
      </Prose>
    </>
  )
}

function Recap() {
  return (
    <Points>
      <Point>
        <code>UI = fn(state)</code>
      </Point>
      <Point>Een state update voert component functions opnieuw uit.</Point>
      <Point>Wie de state bezit bepaalt waar het renderen begint.</Point>
      <Point>Move state down voordat je gaat memoizen.</Point>
      <Point>Context is een subscription, geen gratis global state.</Point>
      <Point>Refs bewaren een waarde zonder een render te triggeren.</Point>
    </Points>
  )
}
