import mongoose from "mongoose"

type connectionObject = {
  isConnected?: number
}

const connection: connectionObject = {}

export async function connectDb(): Promise<void> {
  try {
    if (connection.isConnected) {
      console.log("Instanct of database connection is alredy there")
    }
    const db = await mongoose.connect(process.env.MONGO_DB_URI || "", {})

    connection.isConnected = db.connections[0].readyState

    db.connection.on("conneted", () => {
      console.log("database connected")
    })
    db.connection.on("error", (err) => {
      console.log(`Error while connecting : ${err.message}`)
    })
  } catch (error: any) {
    console.log(`db connectiong failed : ${error?.message}`)
    process.exit(1)
  }
}
