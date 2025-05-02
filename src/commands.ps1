param (
    [string[]]$names = @(
        "order_toppings", "allowed_sizes", "allowed_milks", "allowed_flavors",
        "allowed_grains", "allowed_temps", "allowed_toppings", "temps",
        "grains", "products", "product_types"
    )
)

foreach ($name in $names) {
    Write-Output "Entrando en: $name"

    cd .\$name

    Write-Output "Generando servicio, controlador y módulo para: $name"
    nest g service $name
    nest g controller $name
    nest g module $name

    cd ..
}
