// indexedDB stuff
let indexedDB;
if (self.indexedDB) {
    indexedDB = self.indexedDB;
} else {
    indexedDB = window.indexedDB;
}
let db
const request = indexedDB.open("chat", 1)

request.onupgradeneeded = (IDBVersionChangeEvent) => {
    console.log("onupgradeneeded");
    const db = request.result;
    db.createObjectStore("outbox", { autoIncrement: true });
    db.createObjectStore("inbox", { autoIncrement: true });
};


request.onerror = (error) => {
    console.error("IndexDB open error", error)
}

request.onsuccess = (result) => {
    console.log("IndexDB open success", result)
    db = request.result
    db.onerror = (error) => {
        console.error("IndexDB Database error", error.target.errorCode)
    }
}

const saveChatData = (name, message) => {
    console.log("SaveChatData")
    return new Promise(((resolve, reject) => {
        const transaction = db.transaction(name, "readwrite")
        const store = transaction.objectStore(name)
        store.put(message)
        transaction.oncomplete = () => {
            console.log("Store put complete")
            resolve(true)
        }
        transaction.onerror = () => {
            console.error("Store put error")
            reject(false)
        }
    }))
}

const loadChatData = (name) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(name, "readwrite");
        const store = transaction.objectStore(name);
        const query = store.getAll()
        transaction.oncomplete = () => {
            console.log("query complete", query.result);
            resolve(query.result)
        };
        transaction.onerror = () => {
            console.error("query error");
            reject("query error")
        };
    })
}

const clearChatData = (name) => {
    return new Promise(((resolve, reject) => {
        const transaction = db.transaction(name, "readwrite")
        const store = transaction.objectStore(name)
        store.clear()
        transaction.oncomplete = () => {
            console.log("clear complete");
            resolve(true)
        };
        transaction.onerror = () => {
            console.error("clear error");
            reject("clear error")
        };
    }))
}