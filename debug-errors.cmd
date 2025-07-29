@echo off
title Debug Password Vault
echo.
echo ===============================================
echo           DEBUG DES ERREURS
echo ===============================================
echo.

echo Test 1: Verification TypeScript
echo ---------------------------------
npx tsc --noEmit --skipLibCheck
echo.

echo Test 2: Verification des imports
echo ---------------------------------
echo Verification des fichiers recemment ajoutes...
echo.

echo Test 3: Lancement avec logs detailles
echo --------------------------------------
npm run dev
echo.

pause 