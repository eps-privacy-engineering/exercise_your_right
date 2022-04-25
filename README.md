# README

# exercise_your_right (Nutcracker)

This is a chrome extension to help users exercise their CCPA rights with backend servers and databases. Note: due to security concerns, we do not open the centralized server currently, but you can run a server locally.

usage of this extension:

- Clone the backend server here: ([https://github.com/eps-privacy-engineering/server](https://github.com/eps-privacy-engineering/server)) (Note: this extension could not run without a backend server)
- Execute this script: (should have Golang installed)

```bash
cd server
go build
./server
```

- Install the extension on the browser
- When you browse a website, if it exists in the database, the extension will give you buttons to jump to certain pages at once. If it does not exist, the extension will scan the page to find links and write back to the database. Please allow 5~7 seconds to finish this action.
- If you think a page is a final page for a certain CCPA right or privacy policy, click on ‘finish xxx’ to contribute to the collaborative database. You will see the ‘finish’ flag set to true in the database.
- Welcome to propose new issues

This is a test version, so avoid these actions while using it:

- Modification with high frequency. This will cause concurrent writing to the in-memory map and lead the server to fail.
- Adding too many websites to the database. At this stage, we use the whole file caching for the database, so the IO efficiency may be harmed if there are too many records.