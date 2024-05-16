import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const db = new Dexie('demoDB');
db.version(1).stores({
  data: '++id, value'
});

const StorageManagerDemo = () => {
  const [input, setInput] = useState('');
  const [isPersistent, setIsPersistent] = useState(false);
  const [storageInfo, setStorageInfo] = useState('');
  const data = useLiveQuery(() => db.data.toArray());

  useEffect(() => {
    checkPersistence();
    updateStorageEstimate();
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const addDataToStorage = async () => {
    await db.data.add({ value: input });
    setInput('');
    updateStorageEstimate();
  };

  const checkPersistence = async () => {
    const persisted = await navigator.storage.persisted();
    setIsPersistent(persisted);
  };

  const requestPersistence = async () => {
    if (await navigator.storage.persist()) {
      setIsPersistent(true);
    } else {
      console.log("User declined persistence or it is not supported by the browser.");
    }
    updateStorageEstimate();
  };

  const updateStorageEstimate = async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimation = await navigator.storage.estimate();
      console.log('estimation', estimation)
      setStorageInfo(`Usage: ${estimation.usage} bytes, Quota: ${estimation.quota} bytes`);
    } else {
      console.error("StorageManager API not found");
    }
  };

  return (
    <div>
      <h1>StorageManager API and Dexie Demo</h1>
      <p>Persistent Storage: {isPersistent ? 'Yes' : 'No'}</p>
      <p>{storageInfo}</p>
      <input value={input} onChange={handleInputChange} />
      <button onClick={addDataToStorage}>Add Data</button>
      <button onClick={requestPersistence}>Request Persistence</button>
      <ul>
        {data?.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default StorageManagerDemo;



// https://web.dev/articles/persistent-storage#how_is_permission_granted