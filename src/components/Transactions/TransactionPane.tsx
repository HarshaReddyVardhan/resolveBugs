import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
  updateTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  const handleApprovalChange = async (newValue: boolean) => {
    setApproved(newValue) // Instantly updating UI 

    try {
      await consumerSetTransactionApproval({
        transactionId: transaction.id,
        newValue,
      })

      updateTransactionApproval(transaction.id, newValue) //Persist globally
    } catch (error) {
      console.error("Failed to update transaction approval:", error)
      setApproved(!newValue) // Reverting if request fails
    }
  }

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleApprovalChange} //Use updated function
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
