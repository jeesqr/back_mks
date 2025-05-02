param (
    [string[]]$names  # Permite recibir múltiples nombres como lista
)

foreach ($name in $names) {
    Write-Output "Creando estructura para: $name"

    mkdir $name -ErrorAction SilentlyContinue  # Crea el directorio si no existe
    cd .\$name

    mkdir "dto","entity" -ErrorAction SilentlyContinue

    cd .\entity
    New-Item "$name.entity.ts" -ItemType File -ErrorAction SilentlyContinue
    cd ..

    cd .\dto
    New-Item "create-$name.dto.ts" -ItemType File -ErrorAction SilentlyContinue
    cd ..

    cd ..
}
