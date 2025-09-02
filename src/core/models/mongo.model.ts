import { model, Schema } from 'mongoose'
import { IBaseDocument } from '~/shared/interfaces'

export const baseMongoDbSchema = new Schema<IBaseDocument>(
  {},
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, record) => {
        const { _id, ...object } = record
        delete object.__v
        return { id: _id.toString(), ...object }
      },
    },
  }
)

export const createModal = <T extends IBaseDocument>(
  schemaName: string,
  schema: Schema
) => {
  schema.add(baseMongoDbSchema)
  return model<T>(schemaName, schema)
}
