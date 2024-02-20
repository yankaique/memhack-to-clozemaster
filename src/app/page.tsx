'use client';
import { useState, FormEvent } from "react";
import { CSVLink,} from 'react-csv';
import { FaRegTrashAlt, FaDownload } from "react-icons/fa";

interface IDataState {
    sentence: string;
    translation: string;
    cloze: string;
    pronunciation: string;
    note?: string;
}

interface IObjcetData {
    notes: {
      field: string;
    }[];
}

export default function Home() {
    const [data , setData] = useState<IDataState[]>( [] as IDataState[]);
    const [count , setCount] = useState( 0);
    const [title , setTitle] = useState( '');
    const [payload , setPayload] = useState( '');

  const headers = [
        { label: "Sentence*", key: "sentence" },
        { label: "Translation", key: "translation" },
        { label: "Cloze", key: "cloze" },
        { label: "Pronunciation", key: "pronunciation" },
        { label: "Note", key: "note" },
    ];

    function removeTags(phrase: string) {
        return phrase.replace(/<[^>]*>/g, "");
    }

  function increment() {
      const newData = data;
      let firstField = '';
      let secondField = '';

      const jsonData = payload;

      if(!jsonData) return;

      const objectData = JSON.parse(jsonData) as IObjcetData[];

      objectData.map((item: IObjcetData) => {
          item.notes.map((value, index) => {
            if(index === 0) firstField = removeTags(value.field);
            if(index === 1) secondField = removeTags(value.field);
          });
          newData.push({
              sentence: firstField,
              translation: secondField,
              cloze: firstField,
              pronunciation: firstField,
              note: ""
          })
      })

      setPayload('');
      setData(newData);
      setCount(count + 1);
  }

  function reset() {
      setData([]);
      setCount(0);
      setTitle('');
      setPayload('');
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-24">
    <h1 className="font-bold text-3xl">
        Conversor de data para CSV <span className="text-pink-500">(memhack/clozemasters)</span>
    </h1>
      <div className="flex flex-col p-24 w-full gap-2">
       <input
           value={title}
           onChange={e => setTitle(e.target.value)}
           name='title'
           className="w-full h-24 p-2 text-pink-500 rounded-2xl text-2xl"
           placeholder="Digite o título da matéria"
       />
       <textarea
           value={payload}
           onChange={e => setPayload(e.target.value)}
           name='data'
           className="w-full h-96 p-2 text-pink-500 rounded-2xl text-2xl"
           placeholder="Cole o payload aqui"
       />
       <button
           onClick={increment}
           className="w-full h-20 rounded-2xl bg-pink-500"
       >
            Adicionar {count > 0 && `+${count}`}
       </button>
          {
              count > 0 && (
                  <div className="flex gap-8 w-full align-center justify-center mt-8">
                      <FaRegTrashAlt onClick={reset} size={30} className="cursor-pointer"/>
                      <CSVLink
                          data={data}
                          headers={headers}
                          filename={`${title}.csv`}
                          target="_blank"
                      >
                          <FaDownload size={30} />
                      </CSVLink>
                  </div>
              )
          }
      </div>
    </main>

  );
}
