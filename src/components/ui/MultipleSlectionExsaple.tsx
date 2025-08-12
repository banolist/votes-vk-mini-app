import { Select } from "@kobalte/core/select";
import { createSignal, For } from "solid-js";
import HeroiconsChevronUpDown16Solid from "~icons/heroicons/chevron-up-down-16-solid";
import HeroiconsXMark16Solid from "~icons/heroicons/x-mark-16-solid";
export default function MultipleSelectionExample() {
  const [values, setValues] = createSignal(["Blueberry", "Grapes"]);
  return (
    <>
      <Select<string>
        multiple
        value={values()}
        class="input h-auto py-0.5 w-full max-w-md"
        onChange={setValues}
        options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
        placeholder="Select some fruits…"
        itemComponent={(props) => (
          <Select.Item
            item={props.item}
            class="flex justify-between items-center px-2"
          >
            <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
            <Select.ItemIndicator>
              <HeroiconsXMark16Solid class="size-5" />
            </Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger
          aria-label="Fruits"
          as="div"
          class="flex justify-between w-full items-center"
        >
          <Select.Value<string> class="w-full flex mr-2">
            {(state) => (
              <>
                <div class="flex flex-wrap gap-1 w-full">
                  <For each={state.selectedOptions()}>
                    {(option) => (
                      <span
                        class="p-1 gap-1 bg-base-200 rounded-full flex items-center"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {option}
                        <button
                          class="btn btn-xs btn-circle btn-error"
                          onClick={() => state.remove(option)}
                        >
                          <HeroiconsXMark16Solid />
                        </button>
                      </span>
                    )}
                  </For>
                </div>
                <button
                  class="btn btn-ghost p-0 btn-xs my-1"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={state.clear}
                >
                  <HeroiconsXMark16Solid class="size-6" />
                </button>
              </>
            )}
          </Select.Value>
          <Select.Icon class="py-2 self-start">
            <HeroiconsChevronUpDown16Solid />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Listbox class="bg-base-200 flex flex-col gap-0.5" />
          </Select.Content>
        </Select.Portal>
      </Select>
      <p>Your favorite fruits are: {values().join(", ")}.</p>
    </>
  );
}

// export default function MultipleSelectionExample() {
//   const [values, setValues] = createSignal(["Blueberry", "Grapes"]);
//   return (
//     <>
//       <Select<string>
//         multiple
//         value={values()}
//         class="h-auto py-0.5 w-full max-w-md"
//         onChange={setValues}
//         options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
//         placeholder="Select some fruits…"
//         itemComponent={(props) => (
//           <Select.Item
//             item={props.item}
//             class="flex justify-between items-center px-2"
//           >
//             <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
//             <Select.ItemIndicator>
//               <HeroiconsXMark16Solid class="size-5" />
//             </Select.ItemIndicator>
//           </Select.Item>
//         )}
//       >
//         <Select.Trigger
//           aria-label="Fruits"
//           as="div"
//           class="flex justify-between w-full items-center"
//         >
//           <Select.Value<string> class="w-full flex mr-2">
//             {(state) => (
//               <>
//                 <div class="flex flex-wrap gap-1 w-full">
//                   <For each={state.selectedOptions()}>
//                     {(option) => (
//                       <span
//                         class="p-1 gap-1 bg-base-200 rounded-full flex items-center"
//                         onPointerDown={(e) => e.stopPropagation()}
//                       >
//                         {option}
//                         <button
//                           class="btn btn-xs btn-circle btn-error"
//                           onClick={() => state.remove(option)}
//                         >
//                           <HeroiconsXMark16Solid />
//                         </button>
//                       </span>
//                     )}
//                   </For>
//                 </div>
//                 <button
//                   class="btn btn-ghost p-0 btn-xs my-1"
//                   onPointerDown={(e) => e.stopPropagation()}
//                   onClick={state.clear}
//                 >
//                   <HeroiconsXMark16Solid class="size-6" />
//                 </button>
//               </>
//             )}
//           </Select.Value>
//           <Select.Icon class="py-2 self-start">
//             <HeroiconsChevronUpDown16Solid />
//           </Select.Icon>
//         </Select.Trigger>
//         <Select.Portal>
//           <Select.Content>
//             <Select.Listbox class="bg-base-200 flex flex-col gap-0.5" />
//           </Select.Content>
//         </Select.Portal>
//       </Select>
//       <p>Your favorite fruits are: {values().join(", ")}.</p>
//     </>
//   );
// }
