#!/bin/bash

echo "=== Vérification des fichiers admin ==="
echo

echo "Fichiers dans pages/admin/ :"
ls -la /Users/mac/fournituresScolaire/pages/admin/

echo
echo "=== Recherche de fichiers problématiques ==="
echo "Fichiers broken :"
find /Users/mac/fournituresScolaire/pages/admin/ -name "*broken*" 2>/dev/null || echo "Aucun"

echo "Fichiers old :"
find /Users/mac/fournituresScolaire/pages/admin/ -name "*old*" 2>/dev/null || echo "Aucun"

echo "Fichiers temp :"
find /Users/mac/fournituresScolaire/pages/admin/ -name "*temp*" 2>/dev/null || echo "Aucun"

echo
echo "=== Fichiers finaux ==="
find /Users/mac/fournituresScolaire/pages/admin/ -name "*.vue" | sort
