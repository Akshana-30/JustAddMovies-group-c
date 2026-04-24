# Just Add Movies - Group C








### Prisma



You need to add your own credentials to both the auth secret and the database url.







### Pnpm


Using npm like normal is fine, but it can eventually cause problems when it comes to updating packages as it creates its own package-lock.json file.



If you want to try out pnpm:


npm install -g pnpm (to install it if it's not already working)


pnpm add - to install packages (instead of npm install), has worked with every package I have tried so far


pnpm dlx - equivalent to npx


When installing from package.json you can use the pnpm install to automatically install the packages



It's a really fast bundler that warns you of potential malicious code, unlike npm, which adds everything at installation.







###### Note: if you get errors after installing packages - try pressing ctrl + shift + P and type "restart ts server" and hit enter. It will tell VS Code to look at the new files
