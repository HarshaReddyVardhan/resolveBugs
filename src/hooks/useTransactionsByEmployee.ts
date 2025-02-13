import { useCallback, useState, useEffect } from "react"
import { RequestByEmployeeParams, Transaction } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  // Restore transactions from localStorage on load
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactionsByEmployee")
    if (savedTransactions) {
      setTransactionsByEmployee(JSON.parse(savedTransactions))
    }
  }, [])

  const fetchById = useCallback(
    async (employeeId: string) => {
      const apiTransactions =
        (await fetchWithCache<Transaction[], RequestByEmployeeParams>("transactionsByEmployee", {
          employeeId,
        })) ?? [] // Ensure an array is returned

      setTransactionsByEmployee((prevTransactions) => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactionsByEmployee") || "[]")

        // Merge API transactions with locally saved approvals
        const mergedTransactions = apiTransactions.map((transaction) => {
          const locallyUpdated = savedTransactions.find((t: Transaction) => t.id === transaction.id)
          return locallyUpdated ? { ...transaction, approved: locallyUpdated.approved } : transaction
        })

        // Persist merged transactions in localStorage
        localStorage.setItem("transactionsByEmployee", JSON.stringify(mergedTransactions))

        return mergedTransactions
      })
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  const updateTransactionApproval = useCallback((transactionId: string, newValue: boolean) => {
    setTransactionsByEmployee((prevTransactions) => {
      if (!prevTransactions) return null

      const updatedTransactions = prevTransactions.map((t) =>
        t.id === transactionId ? { ...t, approved: newValue } : t
      )

      // Store updated transactions persistently
      localStorage.setItem("transactionsByEmployee", JSON.stringify(updatedTransactions))

      return updatedTransactions
    })
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData, updateTransactionApproval }
}
