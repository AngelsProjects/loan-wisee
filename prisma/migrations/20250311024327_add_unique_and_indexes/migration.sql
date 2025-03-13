/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taxIdentificationNum]` on the table `Borrower` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taxIdentificationNum]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `RepaymentItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_expires_at_idx" ON "Account"("expires_at");

-- CreateIndex
CREATE INDEX "Account_deletedAt_idx" ON "Account"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_entityType_idx" ON "AuditLog"("entityId", "entityType");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_phoneNumber_key" ON "Borrower"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Borrower_taxIdentificationNum_key" ON "Borrower"("taxIdentificationNum");

-- CreateIndex
CREATE INDEX "Borrower_userId_idx" ON "Borrower"("userId");

-- CreateIndex
CREATE INDEX "Borrower_creditScore_idx" ON "Borrower"("creditScore");

-- CreateIndex
CREATE INDEX "Borrower_employmentStatus_idx" ON "Borrower"("employmentStatus");

-- CreateIndex
CREATE INDEX "Borrower_deletedAt_idx" ON "Borrower"("deletedAt");

-- CreateIndex
CREATE INDEX "BorrowerDocument_borrowerId_idx" ON "BorrowerDocument"("borrowerId");

-- CreateIndex
CREATE INDEX "BorrowerDocument_docType_idx" ON "BorrowerDocument"("docType");

-- CreateIndex
CREATE INDEX "BorrowerDocument_uploadedAt_idx" ON "BorrowerDocument"("uploadedAt");

-- CreateIndex
CREATE INDEX "BorrowerDocument_deletedAt_idx" ON "BorrowerDocument"("deletedAt");

-- CreateIndex
CREATE INDEX "Document_loanId_idx" ON "Document"("loanId");

-- CreateIndex
CREATE INDEX "Document_fileType_idx" ON "Document"("fileType");

-- CreateIndex
CREATE INDEX "Document_uploadedAt_idx" ON "Document"("uploadedAt");

-- CreateIndex
CREATE INDEX "Document_deletedAt_idx" ON "Document"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lender_registrationNumber_key" ON "Lender"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Lender_taxIdentificationNum_key" ON "Lender"("taxIdentificationNum");

-- CreateIndex
CREATE UNIQUE INDEX "Lender_phoneNumber_key" ON "Lender"("phoneNumber");

-- CreateIndex
CREATE INDEX "Lender_userId_idx" ON "Lender"("userId");

-- CreateIndex
CREATE INDEX "Lender_businessType_idx" ON "Lender"("businessType");

-- CreateIndex
CREATE INDEX "Lender_isVerified_idx" ON "Lender"("isVerified");

-- CreateIndex
CREATE INDEX "Lender_deletedAt_idx" ON "Lender"("deletedAt");

-- CreateIndex
CREATE INDEX "Loan_borrowerId_idx" ON "Loan"("borrowerId");

-- CreateIndex
CREATE INDEX "Loan_lenderId_idx" ON "Loan"("lenderId");

-- CreateIndex
CREATE INDEX "Loan_status_idx" ON "Loan"("status");

-- CreateIndex
CREATE INDEX "Loan_startDate_idx" ON "Loan"("startDate");

-- CreateIndex
CREATE INDEX "Loan_endDate_idx" ON "Loan"("endDate");

-- CreateIndex
CREATE INDEX "Loan_nextPaymentDueDate_idx" ON "Loan"("nextPaymentDueDate");

-- CreateIndex
CREATE INDEX "Loan_deletedAt_idx" ON "Loan"("deletedAt");

-- CreateIndex
CREATE INDEX "Loan_riskRating_idx" ON "Loan"("riskRating");

-- CreateIndex
CREATE INDEX "LoanTag_name_idx" ON "LoanTag"("name");

-- CreateIndex
CREATE INDEX "LoanTag_deletedAt_idx" ON "LoanTag"("deletedAt");

-- CreateIndex
CREATE INDEX "Note_loanId_idx" ON "Note"("loanId");

-- CreateIndex
CREATE INDEX "Note_deletedAt_idx" ON "Note"("deletedAt");

-- CreateIndex
CREATE INDEX "Note_createdAt_idx" ON "Note"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RepaymentItem_transactionId_key" ON "RepaymentItem"("transactionId");

-- CreateIndex
CREATE INDEX "RepaymentItem_loanId_idx" ON "RepaymentItem"("loanId");

-- CreateIndex
CREATE INDEX "RepaymentItem_dueDate_idx" ON "RepaymentItem"("dueDate");

-- CreateIndex
CREATE INDEX "RepaymentItem_status_idx" ON "RepaymentItem"("status");

-- CreateIndex
CREATE INDEX "RepaymentItem_paidDate_idx" ON "RepaymentItem"("paidDate");

-- CreateIndex
CREATE INDEX "RepaymentItem_deletedAt_idx" ON "RepaymentItem"("deletedAt");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "Session"("expires");

-- CreateIndex
CREATE INDEX "Session_deletedAt_idx" ON "Session"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "VerificationToken_expires_idx" ON "VerificationToken"("expires");

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_idx" ON "VerificationToken"("identifier");
